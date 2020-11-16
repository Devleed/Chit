import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import Navbar from './Navbar';
import RightTab from './Right tab';
import CenterTab from './Center tab';
import LeftTab from './Left tab';
import { Context } from '../context/chatContext';

const Home = () => {
  const { state, setOnlineUsers } = useContext(Context);
  const [rightTab, setRightTab] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(null);
  const [shortScreen, _setShortScreen] = useState(
    window.innerWidth <= 686 ? true : false
  );

  const shortScreenRef = useRef(shortScreen);

  const setShortScreen = data => {
    shortScreenRef.current = data;
    _setShortScreen(data);
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 686 && !shortScreenRef.current) {
        setShortScreen(true);
      } else if (window.innerWidth > 686 && shortScreenRef.current) {
        setShortScreen(false);
      }
    });
  }, []);

  console.log(state);

  if (!state.auth.user) return null;

  return (
    <Fragment>
      {/* <Alert /> */}
      <Navbar showRightTab={setRightTab} />
      <main className="main">
        <LeftTab
          messagesLoading={messagesLoading}
          setMessagesLoading={setMessagesLoading}
        />
        {state.chat.selectedChat || !shortScreen ? (
          <CenterTab
            messagesLoading={messagesLoading}
            setMessagesLoading={setMessagesLoading}
            showRightTab={setRightTab}
          />
        ) : null}
        <RightTab tab={rightTab} />
      </main>
    </Fragment>
  );
};

export default Home;
