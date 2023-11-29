//@ts-nocheck
import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { scale } from "react-native-size-matters";
import Container from "../../../components/MyProfile/Container";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../constants";
import Carousel from "react-native-reanimated-carousel";
import { router } from "expo-router";
import { Avatar } from "react-native-paper";
import {useQuery, useLazyQuery} from "@apollo/client";
import Toast from "react-native-toast-message";

import { useSubs } from "../../../context/subscriptionProvider";
import { useAuth } from "../../../context/auth";
import defaultCover from "../../../assets/images/default_cover.png";
import defaultProfile from "../../../assets/images/default_profile.jpg";
import { formatWideAddress } from "../../../util/addresssUtils";
import {GET_ALL_REVIEWS} from "../../../graphql/operations/review";
import { formatDate } from "../../../util/dateUtils";

interface IndexProps {
  navigation: {
    goBack: () => void;
  };
}

interface Review {
  _id:string;
  reviewerId:string;
  username:string;
  edited:boolean;
  date:string;
  comment:string;
  profile_pic:string;
  subjectedUser:string
}

const { width: windowWidth } = Dimensions.get("window");

export default function MyProfile({ navigation }: IndexProps) {
  const {profile} = useSubs();
  const {user} = useAuth();
  let userInfo = profile?.profile;

  const [reviews, setReviews] = useState([]);

  const ratingsData = {
    "5": userInfo?.ratingStatistics.fiveStar ?? 0,
    "4": userInfo?.ratingStatistics.fourStar ?? 0,
    "3": userInfo?.ratingStatistics.threeStar ?? 0,
    "2": userInfo?.ratingStatistics.twoStar ?? 0,
    "1": userInfo?.ratingStatistics.oneStar ?? 0,
  };


  const [getAllReviews, {data:getReviewsData, loading:getReviewsLoading}] = useLazyQuery(GET_ALL_REVIEWS, {
    variables:{
      subjectedUser:user.id
    }, 
    onError:(error)=>{
      Toast.show({
        type:"error",
        text1:error?.message
      })
    }
  });

  useEffect(()=>{
    if(profile){
      getAllReviews();
    }
  },[profile]);

  useEffect(()=>{
    if(getReviewsData && !getReviewsLoading){
      setReviews(getReviewsData?.getAllReviews);
    }
  },[getReviewsData, getReviewsLoading])

  const onBackPress = () => {
    router.back();
  };

  const ratingOverview = {
    total: 3,
    average: 5.0,
    countPerStar: {
      "5": 3,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0,
    },
  };

  interface CountPerStar {
    [key: string]: number;
  }

  const renderStars = (count: number) => {
    let stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <FontAwesome key={i} name="star" size={scale(20)} color="#FFD700" />
      );
    }
    return stars;
  };

  const renderRatingBars = (countPerStar: CountPerStar) => {
    return Object.keys(countPerStar)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((star) => (
        <View key={star} style={styles.ratingBarContainer}>
          <Text style={styles.starLabel}>{`${star} star${
            star === "1" ? "" : "s"
          }`}</Text>
          <View style={styles.ratingBar}>
            <View
              style={[
                styles.ratingFill,
                {
                  width: `${
                    (countPerStar[star] / ratingOverview.total) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.ratingCount}>{countPerStar[star]}</Text>
        </View>
      ));
  };


  // Carousel Render Item
  const renderItem = ({ item }: { item: Review }) => {
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={{flexDirection:"row", flex:1}}>
            <Image source={
              item?.profile_pic ? { uri: item?.profile_pic } : defaultProfile
              } style={styles.avatar} />
            <Text style={styles.userNameReview}>{item.username}</Text>
          </View>
          <Text style={{position:"absolute", top:0, right:10, color:"#c5c5c5"}}>{item.edited ? "edited" : ""}</Text>
        </View>
        <ScrollView>
          <Text style={styles.reviewText}>{item.comment}</Text>
          <Text style={{position:"absolute",  bottom:5, right:10, color:"#c5c5c5"}}>{formatDate(item?.createdAt, "ll")}</Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <Container>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="chevron-back" size={scale(25)} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{userInfo?.username}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          {/* Card for Upper Section */}
          <View style={styles.upperCard}>
            <ImageBackground source={
              userInfo?.cover_photo ? {uri:userInfo?.cover_photo} : defaultCover
              } resizeMode="cover" style={styles.coverImageContainer}>
            </ImageBackground>
            {/* <View style={styles.coverImageContainer}>
            </View> */}

            <View style={styles.profileImageOuterContainer}>
              <Avatar.Image 
                source = {
                  userInfo?.profile_pic ? {uri:userInfo.profile_pic} : defaultProfile
                } 
                size={150}
              />
              {/* <View style={styles.profileImageInnerContainer}> */}

                {/* <Text>Profile Image</Text>
              </View> */}
            </View>

            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{userInfo?.username}</Text>
              <Text style={styles.displayName}>{`(${userInfo.displayName})`}</Text>
              <Text style={styles.jobRole}>{userInfo?.role}</Text>
              <Text style={styles.connections}>
                <Text style={styles.connectionsNumber}>{profile?.connections}</Text> 
                {profile?.connections > 1 ? " Connections" : " Connection"}
              </Text>
            </View>
          </View>

          {userInfo?.description ? (<View style={styles.descriptionCard}>
              <Text style={{textAlign:"justify"}}>
                {userInfo?.description}
              </Text>
          </View>):null}

          {/* Card for Details Section */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Details</Text>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={scale(20)} color="#C9C9C9" />
              <Text style={styles.detailText}>{formatWideAddress(userInfo?.address)}</Text>
            </View>

            {userInfo?.account_mobile ? (<View style={styles.detailItem}>
              <Ionicons name="call" size={scale(20)} color="#C9C9C9" />
              <Text style={styles.detailText}>{userInfo.account_mobile}</Text>
            </View>): null}

            {userInfo.account_email ? (<View style={styles.detailItem}>
              <Ionicons name="mail" size={scale(20)} color="#C9C9C9" />
              <Text style={styles.detailText}>{userInfo.account_email}</Text>
            </View>): null}
          </View>

          {/* Card for Rating Overview*/}

          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>
              Rating Overview ({userInfo?.ratingStatistics?.reviewerCount ?? 0})
            </Text>
            <Text style={styles.averageRating}>
              {userInfo.rating.toFixed(1)}
            </Text>
            <View style={styles.starsContainer}>{renderStars(Math.round(userInfo?.rating))}</View>
            {/* {renderRatingBars(ratingsData)} */}
          </View>

          {/* Card for Reviews Section */}

          <View style={styles.bottomCard}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <Carousel
              width={windowWidth}
              height={scale(200)}
              data={reviews}
              renderItem={renderItem}
              autoPlay={false}
              loop={false}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    // padding: scale(10),
    padding:15,
    backgroundColor: COLORS.white,
    //borderBottomWidth: 0.6,
    //borderBottomColor: 'gray',
    marginTop: scale(20),
  },

  headerUsername: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: COLORS.black,
    marginLeft: scale(10),
  },

  scrollContainer: {
    flex: 1,
  },

  mainContainer: {
    backgroundColor: COLORS.pageBg,
  },

  upperCard: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    marginBottom: scale(7),
    paddingBottom: scale(20),
  },

  coverImageContainer: {
    backgroundColor: "lightblue",
    height: scale(250),
    marginBottom: scale(-50),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  profileImageOuterContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: scale(150),
    top: scale(150),
  },

  profileImageInnerContainer: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    height: scale(150),
    width: scale(150),
    borderRadius: scale(75),
    borderWidth: scale(4),
    borderColor: "#FFFFFF",
  },

  userNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(100),
  },

  userName: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: COLORS.black,
  },

  displayName: {
    fontSize: scale(12),
    color: COLORS.black,
    //marginTop: scale(5),
  },

  jobRole: {
    fontSize: scale(14),
    fontWeight: "400",
    color: COLORS.green,
    textTransform: "uppercase",
  },

  connections: {
    fontSize: scale(14),
    color: COLORS.black,
    marginTop: scale(10),
  },

  connectionsNumber: {
    fontWeight: "bold",
    color: COLORS.green,
  },

  detailsCard: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    marginBottom: scale(7),
    paddingTop: scale(10),
    paddingBottom: scale(20),
    paddingLeft: scale(10),
  },
  descriptionCard: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    padding:20,
    marginBottom:10
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(10),
  },

  detailText: {
    marginLeft: scale(10),
    fontSize: scale(14),
    color: COLORS.black,
  },

  detailsTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: scale(10),
  },
  bottomCard: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    marginBottom: scale(10),
    paddingTop: scale(10),
    minHeight: scale(100),
    maxHeight: scale(350),
  },

  reviewsTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: scale(12),
    paddingHorizontal: scale(10),
  },

  reviewCard: {
    backgroundColor: COLORS.pageBg,
    borderRadius: scale(10),
    padding: scale(15),
    marginLeft: scale(25),
    marginRight: scale(25),
    width: windowWidth - 50,
    //marginBottom: scale(10),
    minHeight: scale(150),
    maxHeight: scale(300),
  },

  reviewHeader: {
    flex:1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userNameReview: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  reviewText: {
    marginTop: 5,
  },
  ratingCard: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    marginBottom: scale(10),
    paddingTop: scale(10),
    paddingBottom: scale(20),
    paddingHorizontal: scale(10),
  },
  ratingTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
    marginBottom: scale(8),
    color: COLORS.black,
  },
  averageRating: {
    fontSize: scale(48),
    fontWeight: "bold",
    color: COLORS.black,
    alignSelf: "center",
    marginBottom: scale(8),
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: scale(8),
  },
  ratingBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(4),
  },
  starLabel: {
    fontSize: scale(14),
    marginRight: scale(6),
  },
  ratingBar: {
    flex: 1,
    height: scale(8),
    backgroundColor: "#E0E0E0",
    borderRadius: scale(4),
    overflow: "hidden",
  },
  ratingFill: {
    height: scale(8),
    backgroundColor: COLORS.green,
    borderRadius: scale(4),
  },
  ratingCount: {
    marginLeft: scale(6),
  },
});
