import java.io.File;
import java.util.List;

import org.junit.Test;

import com.winterwell.bob.BuildTask;
import com.winterwell.bob.tasks.MavenDependencyTask;
import com.winterwell.bob.wwjobs.BuildWinterwellProject;
import com.winterwell.utils.io.FileUtils;
import com.winterwell.web.app.build.KPubType;
import com.winterwell.web.app.build.PublishProjectTask;

public class LocalPublishRGE extends PublishProjectTask {

	public LocalPublishRGE() {
		super("rge", null, FileUtils.or(
				new File(FileUtils.getWinterwellDir(), "react-game-engine"),
				FileUtils.getWorkingDirectory())
				);
		setNoPublishJustBuild(true);
		typeOfPublish = KPubType.local;
	}
	
}
