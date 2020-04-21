package com.goodloop.rge;
import com.winterwell.web.app.AMain;
import com.winterwell.web.app.JettyLauncher;
import com.winterwell.web.app.MasterServlet;

public class RGEMain extends AMain<RGEConfig> {

	public static void main(String[] args) {
		RGEMain m = new RGEMain();
		m.doMain(args);
	}
	
	
	@Override
	protected void addJettyServlets(JettyLauncher jl) {	
		super.addJettyServlets(jl);
		MasterServlet ms = jl.addMasterServlet();
//		ms.addServlet("stash", StashServlet.class); ??
	}
	
}
