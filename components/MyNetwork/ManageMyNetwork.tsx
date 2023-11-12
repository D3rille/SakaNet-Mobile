import React, { useState, ReactElement } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, Divider, Button } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

interface RenderHeaderWithButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

const MyConnections: React.FC = () => {
  const [myConnections, setMyConnections] = useState([
    {
      id: 1,
      userAvatar: "https://via.placeholder.com/150",
      name: "Juan dela Cruz",
      location: "Pagbilao, Quezon",
    },
    {
      id: 2,
      userAvatar: "https://via.placeholder.com/150",
      name: "Juan Cruz",
      location: "Quezon",
    },
  ]);

  const [groupsYouManage, setGroupsYouManage] = useState([
    {
      id: 1,
      groupName: "Farming Enthusiasts",
      groupAvatar: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      groupName: "Lucena Farmer Community",
      groupAvatar: "https://via.placeholder.com/150",
    },
  ]);

  const [joinedGroups, setJoinedGroups] = useState([
    {
      id: 1,
      groupName: "Farmers Unite",
      groupAvatar: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      groupName: "Tayabas Community of Farmers",
      groupAvatar: "https://via.placeholder.com/150",
    },
  ]);

  const renderHeaderWithButton = ({
    title,
    iconName,
    onPress,
  }: RenderHeaderWithButtonProps): ReactElement => (
    <View style={styles.headerWithButtonContainer}>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={styles.addButton}>
        <Ionicons name={iconName} size={24} color="#404140" />
      </TouchableOpacity>
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.headerText}>My Connections</Text>
        <Card style={styles.card}>
          {myConnections.map((connection, index) => (
            <React.Fragment key={connection.id}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: connection.userAvatar }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.details}>
                  <Text
                    style={styles.userName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {connection.name}
                  </Text>
                  <Text
                    style={styles.userLocation}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {connection.location}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Button
                    mode="outlined"
                    color="#FE8C47"
                    onPress={() => {}}
                    style={styles.messageButton}
                    labelStyle={styles.buttonLabel}
                    icon={() => (
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={20}
                        color="#FE8C47"
                      />
                    )}
                  >
                    Message
                  </Button>
                </View>
              </Card.Content>
              {index < myConnections.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        {renderHeaderWithButton({
          title: "Groups you manage",
          iconName: "add-outline",
          onPress: () => {},
        })}
        <Card style={styles.card}>
          {groupsYouManage.map((group) => (
            <React.Fragment key={group.id}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: group.groupAvatar }}
                    style={styles.avatar}
                  />
                </View>
                <Text style={styles.groupName}>{group.groupName}</Text>
              </Card.Content>
              <Divider />
            </React.Fragment>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.headerText}>Joined Groups</Text>
        <Card style={styles.card}>
          {joinedGroups.map((group) => (
            <React.Fragment key={group.id}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: group.groupAvatar }}
                    style={styles.avatar}
                  />
                </View>
                <Text style={styles.groupName}>{group.groupName}</Text>
              </Card.Content>
              <Divider />
            </React.Fragment>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  section: {
    marginBottom: 30,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
    marginHorizontal: 20,
    color: "#404140",
  },
  card: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    backgroundColor: "#FDFDFF",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginTop: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2E603A",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  details: {
    justifyContent: "center",
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#404140",
    maxWidth: "88%",
  },
  userLocation: {
    fontSize: 12,
    color: "gray",
    maxWidth: "88%",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  messageButton: {
    borderColor: "#FE8C47",
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonLabel: {
    color: "#FE8C47",
    fontSize: 9,
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#404140",
    marginLeft: 5,
  },
  headerWithButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    marginRight: 25,
  },
});

export default MyConnections;
