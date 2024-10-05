import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RecoilRoot, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { authState, initializeAuthState } from '../authState';
import Header1 from '../components/ui/Header';
import IndexPage from '../components/HomePage';
import CreatePost from '../components/CreatePost';
import PostPage from '../components/PostPage';
import EditPost from '../components/EditPost';
import HeroSection from '../components/ui/Hero';
import Footer from '../components/ui/Footer';
import { ThemeProvider } from '../ThemeContext';

// Lazy load the BlogPost component
const BlogPost = React.lazy(() => import('../components/ShareBlog'));

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
      {/* <Footer /> */}
    </>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <RecoilRoot>
      <AuthInitializer>
        <ThemeProvider>
          <Router>
            <ErrorBoundary>
              <Header1 />
              <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/home' element={<IndexPage />} />
                  <Route path='/create' element={<CreatePost />} />
                  <Route path='/post/:id' element={<PostPage />} />
                  <Route path='/edit/:id' element={<EditPost />} />
                  <Route path='/post/:id/share' element={<BlogPost />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </React.Suspense>
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </AuthInitializer>
    </RecoilRoot>
  );
}

export default App;