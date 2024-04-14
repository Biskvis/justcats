import { useRouter } from 'next/router'
import { db } from '../../app/firebase/config'
import { doc, getDocs, getDoc, collection, query, where, docs } from "firebase/firestore"; 
import isAuth from "@/app/components/isAuth.tsx";
import Layout from '../../app/components/layout';
import PostPage from '@/app/components/PostPage'
import "@/app/globals.css";


function Post({ postData }) {

  const router = useRouter()
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <>  
    <Layout>
        <PostPage postData={postData} />
    </Layout>
    
    </>
  )
}
 
// This function gets called at build time
export async function getStaticPaths() {

    const q = query(collection(db, "posts"));
    const querySnapshot = await getDocs(q);
    const postData = querySnapshot.docs.map((doc) => doc.data());

    const paths = postData.map((post) => ({
        params: { title: post.postId},
    }));
    
    return {
        paths,
        fallback: true, 
    };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // Query Firestore to find the post with the matching title
  const post = doc(db, 'posts', params.title)
  const postsSnapshot = await getDoc(post);

  if (postsSnapshot.empty) {
    return {
        notFound: true, // Return a 404 page if user is not found
    };
  }

  const postData = postsSnapshot.data()
  postData.createdAt = postData.createdAt.toDate().toISOString();
  postData.comments = postData.comments ? JSON.parse(JSON.stringify(postData.comments)) : null;
  // Extract the data of the first post found (assuming title is unique)
  // Pass post data to the page via props
  return {
      props: { postData },
      // Re-generate the page at most once per second if a request comes in
      revalidate: 60,
  };
}


 
export default isAuth(Post)