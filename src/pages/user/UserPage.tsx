import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import htmlParse from "html-react-parser";
import Styled from "./UserPage.module.scss";
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { NicoContext } from "../../provider/NicoProvider";

const NotFoundError = (props: { errorMessage?: string }) => {
  return (
    <Box sx={{ marginLeft: 3 }}>
      <h1>Not Found</h1>
      <h3>{props.errorMessage || "コンテンツが見つかりません"}</h3>
    </Box>
  );
};

const UserPage = () => {
  const nicoContextValue = useContext(NicoContext);
  const { userId } = useParams();
  const [userDescriptionOpen, setUserDescriptionOpen] = useState(false);
  const [userData, setUserData] = useState<NvAPIUser | null>(null);
  const [relationShip, setRelationShip] = useState<NvAPIRelationships | null>(null);
  useEffect(() => {
    (async() => {
      if(userId){
        if(/^[1-9]\d*$/.test(userId)){
          const [_userData, _relationShip] = await nicoContextValue.extension.getUser(parseInt(userId));
          setUserData(_userData);
          setRelationShip(_relationShip);
          if(_userData){
            document.title = `${_userData.nickname} | ExNicoWatch`;
          }
        }
      }
    })();
  }, []);
  return (
    <>
      {userData ? (
        <div className={Styled.userPage}>
          <div className={Styled.userCoverImage}>
            {userData.coverImage ? (
              <img src={userData.coverImage.pcUrl} alt="userCoverImage" />
            ) : (
              <span className={Styled.userCoverMargin}></span>
            )}
          </div>
          <div className={Styled.userProfile}>
            <div className={`${Styled.userIcon} ${userData.coverImage ? Styled.coverMode : ""}`}>
              <img src={userData.icons.large} alt="userIcon" />
            </div>
            <div className={Styled.userDataContainer}>
              <div className={Styled.userData}>
                <div className={Styled.userDataMain}>
                  <Typography variant="h6" component="h1" className={Styled.userNickname}>{userData.nickname}</Typography>
                  <div className={Styled.userDataMeta}>
                    <div className={Styled.userDetail}>
                      <span className={Styled.userId}>{userData.id}{userData.registeredVersion}</span>
                      {userData.isPremium ? (
                        <span className={`${Styled.userType} ${Styled.premium}`}>プレミアム会員</span>
                      ) : (
                        <span className={Styled.userType}>一般会員</span>
                      )}
                    </div>
                    <div className={Styled.userCounts}>
                      <div className={Styled.userCount}>
                        <span className={Styled.userCountLabel}>フォロー中</span>
                        <span className={Styled.userCountNumber}>{userData.followeeCount}</span>
                      </div>
                      <div className={Styled.userCount}>
                        <span className={Styled.userCountLabel}>フォロワー</span>
                        <span className={Styled.userCountNumber}>{userData.followerCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={Styled.userDataButton}>
                  {(nicoContextValue.isLogin && relationShip) && (
                    <>
                      {relationShip.sessionUser.isFollowing ? (
                        <Button size="small" variant="contained">フォロー解除</Button>
                      ) : (
                        <Button size="small" variant="outlined">フォロー</Button>
                      )}
                      <Button className={Styled.supportBtn} variant="outlined">クリサポ</Button>
                    </>
                  )}
                  <IconButton><ShareIcon /></IconButton>
                  <IconButton><MoreVertIcon /></IconButton>
                </div>
              </div>
              <div className={`${Styled.userDescription} ${userDescriptionOpen ? Styled.expanded : ""}`}>
                {userDescriptionOpen ? (
                  <>
                    {htmlParse(userData.description)}
                    <div className={Styled.showMoreDiv}>
                      <span className={Styled.showMoreButton} onClick={() => setUserDescriptionOpen(false)}>閉じる</span>
                    </div>
                  </>
                ) : (
                  <>
                    {userData.strippedDescription}
                    <div className={Styled.showMoreDiv} onClick={() => setUserDescriptionOpen(true)}>
                      <span className={Styled.textMask}></span>
                      <span className={Styled.showMoreButton}>
                        もっと見る
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotFoundError errorMessage="ユーザーが存在しません" />
      )}
    </>
  )
};

export default UserPage;
