const AfriNativeAndroidGenerator = {

  generate(project = {}) {

    const name = project.name || "afritodo";
    const packageName = project.packageName || "com.afridigital.afritodo";
    const versionName = project.version || "1.0.1";
    const generatorVersion = String(project.generatorVersion || "2");
    const language = String(project.language || (generatorVersion === "1" ? "java" : "kotlin")).toLowerCase();

    if (!["java", "kotlin"].includes(language)) {
      throw new Error(`Unsupported native Android language: ${language}`);
    }

    if (generatorVersion === "1" && language !== "java") {
      throw new Error("Native Android Gen 1 requires Java");
    }

    if (generatorVersion === "2" && language !== "kotlin") {
      throw new Error("Native Android Gen 2 requires Kotlin");
    }

    const files = {

      "settings.gradle": `pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = "${name}"
include ":app"
`,

      "build.gradle": `plugins {
    id 'com.android.application' version '8.7.3' apply false
    id 'org.jetbrains.kotlin.android' version '2.0.21' apply false
}
`,

      "gradle.properties": `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
android.aapt2FromMavenOverride=/data/data/com.termux/files/usr/bin/aapt2
`,

      "app/build.gradle": `plugins {
    id 'com.android.application'
    ${language === "kotlin" ? "id 'org.jetbrains.kotlin.android'" : ""}
}

android {
    namespace '${packageName}'
    compileSdk 35

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId '${packageName}'
        minSdk 23
        targetSdk 35
        versionCode 2
        versionName '${versionName}'
    }
}

`,

      "app/src/main/AndroidManifest.xml": `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:theme="@style/AppTheme"
        android:label="AfriTodo"
        android:allowBackup="true">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,

      "app/src/main/res/values/styles.xml": `<resources>
    <style name="AppTheme"
        parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
    </style>
</resources>
`,

      ...(language === "java" ? {
      "app/src/main/java/com/afridigital/afritodo/MainActivity.java": `package ${packageName};

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(32, 48, 32, 32);
        root.setBackgroundColor(Color.rgb(238, 242, 255));

        TextView title = new TextView(this);
        title.setText("🚀 AfriTodo");
        title.setTextSize(28);
        title.setTextColor(Color.rgb(37, 99, 235));
        title.setGravity(Gravity.CENTER);

        TextView subtitle = new TextView(this);
        subtitle.setText("Native Android App • Built with AfriBuild");
        subtitle.setTextSize(16);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 16, 0, 32);

        root.addView(title);
        root.addView(subtitle);

        addTask(root, "✓  Build AfriTodo");
        addTask(root, "○  Connect AfriBuild");
        addTask(root, "○  Deploy App");

        setContentView(root);
    }

    private void addTask(LinearLayout root, String text) {
        TextView task = new TextView(this);
        task.setText(text);
        task.setTextSize(18);
        task.setTextColor(Color.DKGRAY);
        task.setBackgroundColor(Color.WHITE);
        task.setPadding(24, 24, 24, 24);

        LinearLayout.LayoutParams params =
            new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );

        params.setMargins(0, 0, 0, 16);
        root.addView(task, params);
    }
}
`
      } : {}),
      ...(language === "kotlin" ? {
      "app/src/main/java/com/afridigital/afritodo/MainActivity.kt": `package ${packageName}

import android.app.Activity
import android.os.Bundle
import android.graphics.Color
import android.view.Gravity
import android.widget.LinearLayout
import android.widget.TextView

class MainActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 48, 32, 32)
            setBackgroundColor(Color.rgb(238, 242, 255))
        }

        val title = TextView(this).apply {
            text = "🚀 AfriTodo"
            textSize = 28f
            setTextColor(Color.rgb(37, 99, 235))
            gravity = Gravity.CENTER
        }

        val subtitle = TextView(this).apply {
            text = "Native Android App • Kotlin • Built with AfriBuild"
            textSize = 16f
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 32)
        }

        root.addView(title)
        root.addView(subtitle)

        addTask(root, "✓  Build AfriTodo")
        addTask(root, "○  Connect AfriBuild")
        addTask(root, "○  Deploy App")

        setContentView(root)
    }

    private fun addTask(root: LinearLayout, text: String) {
        val task = TextView(this).apply {
            this.text = text
            textSize = 18f
            setTextColor(Color.DKGRAY)
            setBackgroundColor(Color.WHITE)
            setPadding(24, 24, 24, 24)
        }

        val params = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ).apply {
            setMargins(0, 0, 0, 16)
        }

        root.addView(task, params)
    }
}
`
      } : {}),
    };

    return {
      name: `${name}-native`,
      packageName,
      type: "native-android",
      generatorVersion,
      language,
      files
    };
  }

};

export default AfriNativeAndroidGenerator;
