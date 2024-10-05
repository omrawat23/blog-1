import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { authState, initializeAuthState } from '../authState'; // Make sure to create this file
import Header1 from '../components/ui/Header';
import IndexPage from '../components/HomePage';
import CreatePost from '../components/CreatePost';
import PostPage from '../components/PostPage';
import EditPost from '../components/EditPost';
import HeroSection from '../components/ui/Hero';
import Footer from '../components/ui/Footer';
import { ThemeProvider } from '../ThemeContext';
import BlogPost from '../components/ShareBlog';


function AuthInitializer({ children }) {
  const [, setAuthStateValue] = useRecoilState(authState);
  const authStateLoadable = useRecoilValueLoadable(initializeAuthState);

  React.useEffect(() => {
    if (authStateLoadable.state === 'hasValue') {
      setAuthStateValue(authStateLoadable.contents);
    }
  }, [authStateLoadable, setAuthStateValue]);

  if (authStateLoadable.state === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}

function Home() {
  return (
    <>
      <HeroSection />
      {/* <Footer/> */}
    </>
  );
}

function App() {
  return (
    <RecoilRoot>
      <AuthInitializer>
        <ThemeProvider>
          <Router>
            <Header1/>
            <Routes>
              <Route path='/' element={<Home />} />

              <Route path='/home' element={<IndexPage />} />
              <Route path='/create' element={<CreatePost />} />
              <Route path='/post/:id' element={<PostPage />} />
              <Route path='/edit/:id' element={<EditPost />} />
              <Route path='/post/:id/share' element={<BlogPost />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthInitializer>
    </RecoilRoot>
  );
}

export default App;