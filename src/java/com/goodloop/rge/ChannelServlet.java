package com.goodloop.rge;


import com.winterwell.depot.merge.Merger;
import com.winterwell.utils.containers.ArrayMap;
import com.winterwell.utils.containers.Containers;
import com.winterwell.utils.time.TUnit;
import com.winterwell.utils.time.Time;
import com.winterwell.utils.web.SimpleJson;
import com.winterwell.web.ajax.JSend;
import com.winterwell.web.ajax.JThing;
import com.winterwell.web.app.CrudServlet;
import com.winterwell.web.app.IServlet;
import com.winterwell.web.app.WebRequest;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.eclipse.jetty.util.ajax.JSON;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
/**
 * TODO poor-mans web sockets
 * @author daniel
 *
 */
public class ChannelServlet implements IServlet {


	static Cache<String,Channel> channels = CacheBuilder.newBuilder()
				.expireAfterAccess(10, TimeUnit.MINUTES).build();
	
	@Override
	public void process(WebRequest state) throws Exception {
		String schannel = state.getSlugBits(1);		
		if ("_list".equals(schannel)) {
			doList(state);
			return;
		}
		
		Channel channel = channels.getIfPresent(schannel);
		if (channel==null) {
			channel = new Channel(schannel);
			channels.put(schannel, channel);
		}
		
		// set state?
		String room = state.get("room");
		String diff = state.get("diff");
		if (diff!=null) {
			Object jdiff = JSON.parse(diff);
			channel.room = applyDiff(channel.room, jdiff);
		} else if (room != null) {
			Map jroom = (Map) JSON.parse(room);
			channel.room = merge(channel.room, jroom);
		}
		String peerId = state.get("peerId");
		if (peerId !=null) {
			Map members = SimpleJson.getCreate(channel.room, "members");
			Map peer = SimpleJson.getCreate(members, peerId);
			peer.put("connection", new Time()); 
			// time out
			Time old = new Time().minus(10, TUnit.SECOND);
			Collection<Map> peers = members.values();
			for (Map user : peers) {
				Object conn = user.get("connection");
				System.out.println(conn);
				if (conn instanceof Time) {
					if (((Time)conn).isBefore(old)) {
						user.put("connection", false);
					}
				}
			}
		}
		
		JSend jsend = new JSend();
		JThing data = new JThing(channel);
		jsend.setData(data);
		jsend.send(state);
		
	}

	private void doList(WebRequest state) {
		JSend jsend = new JSend();		
		Collection<Channel> cs = channels.asMap().values();		
		jsend.setData(new JThing(cs));
		jsend.send(state);
	}

	private Map applyDiff(Map room, Object jdiff) {
		List<Map> diffs = Containers.asList(jdiff);		
		if (diffs.isEmpty()) {
			return room;
		}
		for (Map diff : diffs) {
			String op = (String) diff.get("op");
			String path = (String) diff.get("path");
			Object value = diff.get("value");
//			set(room, path, value);
			String[] bits = path.split("/");
			Map obj = room;
			for(int bi=1; bi<bits.length-1; bi++) {
				String bit = bits[bi];
				Map bobj = (Map) obj.get(bit);
				if (bobj==null) {
					bobj = new ArrayMap();
					obj.put(bit, bobj);
				}
				obj = bobj;
			}
			String k = bits[bits.length-1];
			obj.put(k, value);
			System.out.println(path);
		}
		// TODO Auto-generated method stub
		return room;
	}

	static Merger merger = new Merger();
	
	private Map merge(Map room, Map jroom) {
		Map merged = (Map) merger.doMerge(null, room, jroom);
		return merged;
	}

}
