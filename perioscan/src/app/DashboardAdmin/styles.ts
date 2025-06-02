import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adminLabel: {
    color: "#fff",
    fontSize: 12,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    paddingTop: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  seeAll: {
    color: "#666",
    fontSize: 14,
  },
  statsCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  statsLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  distributionSection: {
    padding: 20,
  },
  chartsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  pieChartContainer: {
    flex: 1,
    alignItems: "center",
  },
  recentSection: {
    padding: 20,
  },
  recentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  recentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  recentDate: {
    fontSize: 12,
    color: "#666",
  },
  recentCreator: {
    fontSize: 12,
    color: "#666",
  },
  recentStatus: {
    fontSize: 12,
    color: "#666",
  },
  bottomSpacing: {
    height: 70,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
