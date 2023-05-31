import java.io.File;
import java.util.List;

import org.junit.Test;

import com.winterwell.bob.BuildTask;
import com.winterwell.bob.tasks.MavenDependencyTask;
import com.winterwell.bob.wwjobs.BuildWinterwellProject;
import com.winterwell.utils.io.FileUtils;

public class BuildGoose extends BuildWinterwellProject {

	public BuildGoose() {
		super(new File("."), "goose");
		setVersion("0.0.1"); 
	}

	@Override
	public List<BuildTask> getDependencies() {
		List<BuildTask> deps = super.getDependencies();
		MavenDependencyTask mdt = new MavenDependencyTask();
		mdt.addDependency("com.google.guava", "guava", "28.2-jre");
		
		String jversion = "10.0.15";
		String jakarta = "1.1.2";
		
      mdt.addDependency("jakarta.websocket:jakarta.websocket-api:"+jakarta);
//	    <!-- To run javax.websocket in embedded server -->
      mdt.addDependency("org.eclipse.jetty.websocket:websocket-javax-server:"+jversion);
//	    <!-- To run javax.websocket client -->
      mdt.addDependency("org.eclipse.jetty.websocket:websocket-javax-client:"+jversion);
      
//		mdt.addDependency("org.eclipse.jetty.websocket:websocket-jetty-api:"+jversion);
//		mdt.addDependency("org.eclipse.jetty.websocket:websocket-jetty-api:"+jversion);
//		mdt.addDependency("org.eclipse.jetty.websocket:websocket-jetty-server:"+jversion);
////		mdt.addDependency("org.eclipse.jetty.websocket:websocket-server:"+jversion); // version??
////	    <!-- To run websockets client -->
//		mdt.addDependency("org.eclipse.jetty.websocket:websocket-jetty-client:"+jversion);

//      try {
//		mdt.doTask();
//	} catch (Exception e) {
//		// TODO Auto-generated catch block
//		e.printStackTrace();
//	}
      
		deps.add(mdt);
		return deps;
	}
	
}
