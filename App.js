import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const PROGRESS_KEY = "@internee_lms_progress";
const DOWNLOADS_KEY = "@internee_lms_downloads";
const MATERIAL_DIR = FileSystem.documentDirectory + "course_materials/";

const courses = [
  {
    id: "course-1",
    title: "React Native Basics",
    category: "Mobile Development",
    instructor: "Internee.pk Mentor",
    duration: "2 Weeks",
    level: "Beginner",
    description:
      "Learn the fundamentals of React Native including components, props, state, styling, and mobile UI structure.",
    lessons: [
      "Introduction to React Native",
      "Components and Props",
      "State Management",
      "Styling in React Native",
      "Building First Mobile Screen",
    ],
    materials: [
      {
        id: "mat-1",
        title: "React Native Introduction Notes",
        type: "TXT",
        content:
          "React Native is a cross-platform framework used to build mobile apps for Android and iOS using JavaScript and React concepts.",
      },
      {
        id: "mat-2",
        title: "Components Practice Guide",
        type: "TXT",
        content:
          "Practice creating reusable components such as Header, CourseCard, ProgressBar, and Button components.",
      },
    ],
  },
  {
    id: "course-2",
    title: "JavaScript for Mobile Apps",
    category: "Programming",
    instructor: "Internee.pk Mentor",
    duration: "10 Days",
    level: "Beginner",
    description:
      "Improve JavaScript concepts required for React Native app development including arrays, objects, functions, and async code.",
    lessons: [
      "Variables and Data Types",
      "Functions",
      "Arrays and Objects",
      "Promises and Async/Await",
      "API Calling Basics",
    ],
    materials: [
      {
        id: "mat-1",
        title: "JavaScript Revision Sheet",
        type: "TXT",
        content:
          "Important JavaScript topics: variables, functions, arrays, objects, map, filter, promises, async/await, and fetch API.",
      },
    ],
  },
  {
    id: "course-3",
    title: "UI Design for Mobile Apps",
    category: "Design",
    instructor: "Internee.pk Mentor",
    duration: "1 Week",
    level: "Intermediate",
    description:
      "Learn mobile dashboard design, spacing, cards, colors, typography, and user-friendly layouts for LMS apps.",
    lessons: [
      "Mobile UI Principles",
      "Card Layouts",
      "Color and Typography",
      "Dashboard Design",
      "Final UI Practice",
    ],
    materials: [
      {
        id: "mat-1",
        title: "Mobile UI Design Checklist",
        type: "TXT",
        content:
          "A good mobile UI should be clean, readable, responsive, consistent, and easy to navigate.",
      },
    ],
  },
];

function ProgressBar({ progress }) {
  return (
    <View style={styles.progressBackground}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  );
}

function HomeScreen({ navigation, progressData, downloads }) {
  const totalCourses = courses.length;
  const completedCourses = courses.filter(
    (course) => (progressData[course.id] || 0) === 100
  ).length;

  const averageProgress =
    courses.reduce((sum, course) => sum + (progressData[course.id] || 0), 0) /
    totalCourses;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Internee.pk LMS</Text>
          <Text style={styles.appSubtitle}>
            Learn, track progress, and access course materials offline.
          </Text>
        </View>

        <View style={styles.dashboardCard}>
          <Text style={styles.sectionTitle}>Learning Dashboard</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalCourses}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCourses}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{Math.round(averageProgress)}%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Available Courses</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Downloads")}>
              <Text style={styles.linkText}>
                Downloads ({Object.keys(downloads).length})
              </Text>
            </TouchableOpacity>
          </View>

          {courses.map((course) => {
            const progress = progressData[course.id] || 0;

            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() =>
                  navigation.navigate("CourseDetail", {
                    courseId: course.id,
                  })
                }
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.badge}>{course.level}</Text>
                </View>

                <Text style={styles.courseCategory}>{course.category}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>

                <View style={styles.rowBetween}>
                  <Text style={styles.smallText}>Duration: {course.duration}</Text>
                  <Text style={styles.smallText}>{progress}% Complete</Text>
                </View>

                <ProgressBar progress={progress} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CourseDetailScreen({
  route,
  navigation,
  progressData,
  updateProgress,
  downloadMaterial,
  downloads,
}) {
  const { courseId } = route.params;
  const course = courses.find((item) => item.id === courseId);
  const progress = progressData[course.id] || 0;
  const completedLessons = Math.round((progress / 100) * course.lessons.length);

  const completeNextLesson = () => {
    const lessonProgress = Math.round(100 / course.lessons.length);
    const newProgress = Math.min(progress + lessonProgress, 100);
    updateProgress(course.id, newProgress);
  };

  const resetProgress = () => {
    updateProgress(course.id, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{course.title}</Text>
          <Text style={styles.detailSubtitle}>{course.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Course Information</Text>

          <Text style={styles.infoText}>Instructor: {course.instructor}</Text>
          <Text style={styles.infoText}>Category: {course.category}</Text>
          <Text style={styles.infoText}>Duration: {course.duration}</Text>
          <Text style={styles.infoText}>Level: {course.level}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress Tracking</Text>

          <Text style={styles.progressText}>{progress}% Completed</Text>
          <ProgressBar progress={progress} />

          <Text style={styles.infoText}>
            Completed Lessons: {completedLessons} / {course.lessons.length}
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={completeNextLesson}>
            <Text style={styles.buttonText}>Complete Next Lesson</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={resetProgress}>
            <Text style={styles.secondaryButtonText}>Reset Progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lessons</Text>

          {course.lessons.map((lesson, index) => {
            const isCompleted = index < completedLessons;

            return (
              <View key={lesson} style={styles.lessonRow}>
                <Text style={styles.lessonNumber}>
                  {isCompleted ? "✓" : index + 1}
                </Text>
                <Text
                  style={[
                    styles.lessonText,
                    isCompleted && styles.completedLessonText,
                  ]}
                >
                  {lesson}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Course Materials</Text>

          {course.materials.map((material) => {
            const downloadKey = `${course.id}_${material.id}`;
            const isDownloaded = downloads[downloadKey];

            return (
              <View key={material.id} style={styles.materialBox}>
                <View>
                  <Text style={styles.materialTitle}>{material.title}</Text>
                  <Text style={styles.smallText}>Type: {material.type}</Text>
                </View>

                <TouchableOpacity
                  style={isDownloaded ? styles.downloadedButton : styles.downloadButton}
                  onPress={() => downloadMaterial(course, material)}
                >
                  <Text style={styles.buttonText}>
                    {isDownloaded ? "Downloaded" : "Download"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Downloads")}
          >
            <Text style={styles.secondaryButtonText}>View Offline Materials</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DownloadsScreen({ downloads, openDownloadedMaterial }) {
  const downloadedItems = Object.values(downloads);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Offline Materials</Text>
          <Text style={styles.appSubtitle}>
            Downloaded course materials are available for offline access.
          </Text>
        </View>

        <View style={styles.card}>
          {downloadedItems.length === 0 ? (
            <Text style={styles.emptyText}>No course materials downloaded yet.</Text>
          ) : (
            downloadedItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.downloadItem}
                onPress={() => openDownloadedMaterial(item)}
              >
                <Text style={styles.materialTitle}>{item.materialTitle}</Text>
                <Text style={styles.smallText}>Course: {item.courseTitle}</Text>
                <Text style={styles.smallText}>Saved at: {item.downloadedAt}</Text>
                <Text style={styles.openText}>Tap to open offline material</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [progressData, setProgressData] = useState({});
  const [downloads, setDownloads] = useState({});

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(PROGRESS_KEY);
      const savedDownloads = await AsyncStorage.getItem(DOWNLOADS_KEY);

      if (savedProgress) {
        setProgressData(JSON.parse(savedProgress));
      }

      if (savedDownloads) {
        setDownloads(JSON.parse(savedDownloads));
      }
    } catch (error) {
      Alert.alert("Error", "Unable to load saved LMS data.");
    }
  };

  const updateProgress = async (courseId, progress) => {
    try {
      const updatedProgress = {
        ...progressData,
        [courseId]: progress,
      };

      setProgressData(updatedProgress);
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
    } catch (error) {
      Alert.alert("Error", "Unable to save course progress.");
    }
  };

  const ensureMaterialDirectory = async () => {
    const dirInfo = await FileSystem.getInfoAsync(MATERIAL_DIR);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(MATERIAL_DIR, {
        intermediates: true,
      });
    }
  };

  const downloadMaterial = async (course, material) => {
    try {
      await ensureMaterialDirectory();

      const fileName = `${course.id}_${material.id}.txt`;
      const fileUri = MATERIAL_DIR + fileName;

      const fileContent = `
${material.title}

Course: ${course.title}
Instructor: ${course.instructor}

Material:
${material.content}

Downloaded for offline access in Internee.pk LMS App.
      `;

      await FileSystem.writeAsStringAsync(fileUri, fileContent);

      const downloadKey = `${course.id}_${material.id}`;

      const updatedDownloads = {
        ...downloads,
        [downloadKey]: {
          key: downloadKey,
          courseId: course.id,
          courseTitle: course.title,
          materialTitle: material.title,
          uri: fileUri,
          downloadedAt: new Date().toLocaleString(),
        },
      };

      setDownloads(updatedDownloads);
      await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updatedDownloads));

      Alert.alert("Downloaded", "Course material saved for offline access.");
    } catch (error) {
      Alert.alert("Error", "Unable to download course material.");
    }
  };

  const openDownloadedMaterial = async (item) => {
    try {
      const content = await FileSystem.readAsStringAsync(item.uri);

      Alert.alert(item.materialTitle, content);
    } catch (error) {
      Alert.alert("Error", "Unable to open offline material.");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2563eb",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="Home" options={{ title: "LMS Dashboard" }}>
          {(props) => (
            <HomeScreen
              {...props}
              progressData={progressData}
              downloads={downloads}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="CourseDetail"
          options={{ title: "Course Details" }}
        >
          {(props) => (
            <CourseDetailScreen
              {...props}
              progressData={progressData}
              updateProgress={updateProgress}
              downloadMaterial={downloadMaterial}
              downloads={downloads}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Downloads" options={{ title: "Offline Materials" }}>
          {(props) => (
            <DownloadsScreen
              {...props}
              downloads={downloads}
              openDownloadedMaterial={openDownloadedMaterial}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 18,
  },

  header: {
    marginTop: 14,
    marginBottom: 18,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  appSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  dashboardCard: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  statBox: {
    backgroundColor: "rgba(255,255,255,0.16)",
    width: "31%",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },

  statLabel: {
    fontSize: 12,
    color: "#e0ecff",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  linkText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "bold",
  },

  courseCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    marginRight: 10,
  },

  badge: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },

  courseCategory: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 6,
  },

  courseDescription: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 12,
  },

  smallText: {
    fontSize: 13,
    color: "#6b7280",
  },

  progressBackground: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 20,
  },

  detailHeader: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 20,
    marginTop: 14,
    marginBottom: 16,
  },

  detailTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
  },

  detailSubtitle: {
    color: "#dbeafe",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  infoText: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 22,
  },

  progressText: {
    fontSize: 22,
    color: "#16a34a",
    fontWeight: "bold",
    marginBottom: 4,
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },

  secondaryButton: {
    backgroundColor: "#eaf2ff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },

  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "bold",
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  lessonNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    textAlign: "center",
    lineHeight: 30,
    fontWeight: "bold",
    marginRight: 10,
  },

  lessonText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },

  completedLessonText: {
    color: "#16a34a",
    textDecorationLine: "line-through",
  },

  materialBox: {
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  materialTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },

  downloadButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  downloadedButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  downloadItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  openText: {
    color: "#2563eb",
    fontWeight: "bold",
    marginTop: 8,
  },

  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
    paddingVertical: 20,
  },
});