interface NvAPIResponse<T> {
  meta: NvAPIMeta;
  data?: T;
}

interface NvAPIMeta {
  status: number;
  errorCode?: string;
}

interface NvAPIUserResponse {
  user: NvAPIUser;
  relationships: NvAPIRelationships;
}

interface NvAPIOwnUserResponse {
  user: NvAPIOwnUser;
}

interface NvAPIUser {
  id: number;
  nickname: string;
  icons: {
    small: string;
    large: string;
  };
  description: string;
  decoratedDescriptionHtml: string;
  strippedDescription: string;
  isPremium: boolean;
  registeredVersion: string;
  followeeCount: number;
  followerCount: number;
  userLevel: {
    currentLevel: number;
    nextLevelThresholdExperience: number;
    nextLevelExperience: number;
    currentLevelExperience: number;
  };
  userChannel?: NvAPIChannel;
  isNicorepoReadable: boolean;
  sns: NvAPISNS[];
  coverImage?: {
    ogpUrl: string;
    pcUrl: string;
    smartphoneUrl: string;
  };
}

interface NvAPIChannel {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  thumbnailSmallUrl: string;
}

interface NvAPISNS {
  type: string;
  label: string;
  iconUrl: string;
  screenName: string;
  url: string;
}

interface NvAPIOwnUser extends NvAPIUser {
  niconicoPoint: number;
  language: string;
  premiumTicketExpireTime: string | null;
  creatorPatronizingScore: number;
  isMailBounced: boolean;
  isNicorepoAutoPostedToTwitter: boolean;
}

interface NvAPIRelationships {
  sessionUser: {
    isFollowing: boolean;
  };
  isMe: boolean;
}

interface NvAPIThreadkey {
  threadKey: string;
}

interface NvAPIPostkey {
  postKey: string;
}
