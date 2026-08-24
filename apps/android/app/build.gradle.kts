import java.util.Properties
import org.gradle.api.tasks.Exec

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.plugin.compose")
}

if (file("google-services.json").exists()) {
    apply(plugin = "com.google.gms.google-services")
}

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("keystore.properties")
if (keystorePropertiesFile.exists()) {
    keystorePropertiesFile.inputStream().use(keystoreProperties::load)
}
fun escapedBuildConfigString(value: String): String = value.replace("\\", "\\\\").replace("\"", "\\\"")

val debugBiometricBypass = System.getenv("SHELLY_ANDROID_BIOMETRIC_BYPASS") == "true"
val debugPairingCode = escapedBuildConfigString(System.getenv("SHELLY_ANDROID_PAIRING_CODE").orEmpty())
val relayControlUrl = escapedBuildConfigString(System.getenv("SHELLY_RELAY_CONTROL_URL").orEmpty())
val shellyAndroidVersionCode = System.getenv("SHELLY_ANDROID_VERSION_CODE")?.toIntOrNull() ?: 1
val shellyAndroidVersionName = System.getenv("SHELLY_ANDROID_VERSION_NAME")?.takeIf { it.isNotBlank() } ?: "1.0"
val repoRoot = rootProject.projectDir.parentFile.parentFile
val buildRustMobileCore = tasks.register<Exec>("buildRustMobileCore") {
    group = "build"
    description = "Builds Rust mobile-core libraries and regenerates UniFFI Kotlin bindings."
    workingDir = repoRoot
    commandLine(rootProject.file("scripts/build-rust.sh").absolutePath)
    inputs.dir(repoRoot.resolve("crates/mobile-core"))
    inputs.dir(repoRoot.resolve("crates/protocol"))
    inputs.file(repoRoot.resolve("Cargo.toml"))
    inputs.file(repoRoot.resolve("Cargo.lock"))
    inputs.file(rootProject.file("scripts/build-rust.sh"))
    outputs.dir(rootProject.file("generated"))
    outputs.dir(project.file("src/main/jniLibs"))
}

android {
    namespace = "app.shelly.android"
    compileSdk = 36
    ndkVersion = "27.1.12297006"

    lint {
        // Adopt Lint on a previously-unlinted codebase: the baseline grandfathers the
        // current issues (generated-uniffi Cleaner NewApi calls that are runtime-guarded,
        // pre-existing manifest/permission nits) so new regressions still fail the build.
        baseline = file("lint-baseline.xml")
        abortOnError = true
        // The UniFFI bindings are generated into ../generated (a srcDir outside this
        // module). With a baseline configured, lintVitalRelease's partial-results
        // serialization throws "Path variable ... not provided to serialization" for
        // that external source root (an AGP bug), crashing `bundleRelease`. Lint still
        // runs via the explicit `:app:lintDebug` CI step against the baseline, so skip
        // the redundant release-time vital pass rather than lint generated code.
        checkReleaseBuilds = false
    }

    defaultConfig {
        applicationId = "app.shelly.android"
        minSdk = 30
        targetSdk = 36
        versionCode = shellyAndroidVersionCode
        versionName = shellyAndroidVersionName
        buildConfigField("boolean", "SHELLY_BIOMETRIC_BYPASS", "false")
        buildConfigField("String", "SHELLY_DEBUG_PAIRING_CODE", "\"\"")
        buildConfigField("String", "SHELLY_RELAY_CONTROL_URL", "\"$relayControlUrl\"")
        ndk {
            abiFilters += listOf("arm64-v8a", "x86_64")
            debugSymbolLevel = "FULL"
        }
    }

    sourceSets {
        getByName("main") {
            kotlin.directories += "../generated"
        }
    }

    packaging {
        jniLibs {
            excludes += listOf("**/libiroh-*.so", "**/libiroh_relay-*.so")
        }
    }

    buildFeatures {
        buildConfig = true
        compose = true
    }

    testOptions {
        unitTests {
            isIncludeAndroidResources = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    signingConfigs {
        create("release") {
            if (keystorePropertiesFile.exists()) {
                storeFile = rootProject.file(keystoreProperties["storeFile"] as String)
                storePassword = keystoreProperties["storePassword"] as String
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
            }
        }
    }

    buildTypes {
        getByName("debug") {
            buildConfigField("boolean", "SHELLY_BIOMETRIC_BYPASS", debugBiometricBypass.toString())
            buildConfigField("String", "SHELLY_DEBUG_PAIRING_CODE", "\"$debugPairingCode\"")
        }
        getByName("release") {
            buildConfigField("boolean", "SHELLY_BIOMETRIC_BYPASS", "false")
            buildConfigField("String", "SHELLY_DEBUG_PAIRING_CODE", "\"\"")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            if (keystorePropertiesFile.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2026.03.01"))
    implementation("androidx.activity:activity-compose:1.13.0")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.10.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.10.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-savedstate:2.10.0")
    implementation("androidx.navigation:navigation-compose:2.9.7")
    implementation("androidx.work:work-runtime-ktx:2.10.1")
    implementation("androidx.fragment:fragment-ktx:1.8.9")
    implementation("androidx.biometric:biometric-ktx:1.4.0-alpha02")
    implementation(platform("com.google.firebase:firebase-bom:34.13.0"))
    implementation("com.google.firebase:firebase-messaging")

    implementation("androidx.camera:camera-camera2:1.5.1")
    implementation("androidx.camera:camera-lifecycle:1.5.1")
    implementation("androidx.camera:camera-view:1.5.1")
    implementation("com.google.mlkit:barcode-scanning:17.3.0")

    implementation("org.connectbot:termlib:0.1.0")
    implementation("net.java.dev.jna:jna:5.19.1@aar")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2")

    debugImplementation("androidx.compose.ui:ui-tooling")
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.robolectric:robolectric:4.16")
    testImplementation(platform("androidx.compose:compose-bom:2026.03.01"))
    testImplementation("androidx.compose.ui:ui-test-junit4")
}

tasks.matching { task ->
    (task.name.startsWith("compile") && task.name.endsWith("Kotlin")) ||
        (task.name.startsWith("merge") && task.name.endsWith("JniLibFolders")) ||
        (task.name.startsWith("merge") && task.name.endsWith("NativeLibs"))
}.configureEach {
    dependsOn(buildRustMobileCore)
}
