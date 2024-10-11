export type TiktokLiveEvent = {
  roomUser: RoomUserData;
  like: LikeData;
  gift: GiftData;
  member: MemberData;
  social: SocialData;
  follow: FollowData;
  share: ShareData;
  subscribe: SubscribeData;
  chat: ChatData;
};
export interface ChatData {
  emotes: any[];
  comment: string;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userSceneTypes: number[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  gifterLevel: number;
  teamMemberLevel: number;
  msgId: string;
  createTime: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface UserDetails {
  createTime: string;
  bioDescription: string;
  profilePictureUrls: string[];
}

export interface SubscribeData {
  subMonth: number;
  oldSubscribeStatus: number;
  subscribingStatus: number;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  msgId: string;
  createTime: string;
  displayType: string;
  label: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface ShareData {
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  msgId: string;
  createTime: string;
  displayType: string;
  label: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface FollowData {
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  msgId: string;
  createTime: string;
  displayType: string;
  label: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface SocialData {
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userSceneTypes: any[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  gifterLevel: number;
  teamMemberLevel: number;
  msgId: string;
  createTime: string;
  label: string;
  displayType: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface MemberData {
  actionId: number;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userSceneTypes: any[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  gifterLevel: number;
  teamMemberLevel: number;
  createTime: string;
  msgId: string;
  displayType: string;
  label: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface RoomUserData {
  topViewers: TopViewer[];
  viewerCount: number;
}

export interface TopViewer {
  user: User;
  coinCount: number;
}

export interface User {
  userId: string;
  secUid: string;
  uniqueId?: string;
  nickname?: string;
  profilePictureUrl: null | string;
  userBadges: UserBadge[];
  userSceneTypes: any[];
  userDetails: UserDetails;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  gifterLevel: number;
  teamMemberLevel: number;
}

export interface LikeData {
  likeCount: number;
  totalLikeCount: number;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userSceneTypes: number[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  gifterLevel: number;
  teamMemberLevel: number;
  createTime: string;
  msgId: string;
  displayType: string;
  label: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface GiftData {
  giftId: number;
  repeatCount: number;
  repeatEnd: boolean;
  groupId: string;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  followRole: number;
  userBadges: UserBadge[];
  userSceneTypes: number[];
  userDetails: UserDetails;
  followInfo: FollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  gifterLevel: number;
  teamMemberLevel: number;
  msgId: string;
  createTime: string;
  displayType: string;
  label: string;
  gift: Gift;
  describe: string;
  giftType: number;
  diamondCount: number;
  giftName: string;
  giftPictureUrl: string;
  timestamp: number;
  receiverUserId: string;
}

export interface FollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}

export interface Gift {
  gift_id: number;
  repeat_count: number;
  repeat_end: number;
  gift_type: number;
}

export interface UserBadge {
  type: string;
  badgeSceneType?: number;
  displayType?: number;
  url?: string;
  privilegeId?: string;
  level?: number;
}

export interface UserDetails {
  createTime: string;
  bioDescription: string;
  profilePictureUrls: string[];
}
