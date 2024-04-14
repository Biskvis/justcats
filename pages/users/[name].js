import { useRouter } from 'next/router'
import { db } from '../../app/firebase/config'
import { doc, getDocs, getDoc, collection, query, where } from "firebase/firestore"; 
import isAuth from "@/app/components/isAuth.tsx";
import Layout from '../../app/components/layout';
import UserPage from '../../app/components/UserPage';
import "@/app/globals.css";


function User({ userData, postData }) {
  const router = useRouter()
 
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <>  
    <Layout>
        <UserPage data={postData} user={userData} />
    </Layout>
    
    </>
  )
}
 
// This function gets called at build time
export async function getStaticPaths() {

    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const userData = querySnapshot.docs.map((doc) => doc.data());

    const paths = userData.map((user) => ({
        params: { name: user.name},
    }));

    return {
        paths,
        fallback: true, // Generate all paths at build time
    };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    // params contains the user's `name`
    // If the route is like /users/john, then params.name is 'john'
    const q = query(collection(db, "users"), where("name", "==", params.name));
    const posts = query(collection(db, "posts"), where("name", "==", params.name));
    const querySnapshot = await getDocs(q);
    const postsSnapshot = await getDocs(posts);
    if (querySnapshot.empty) {
        return {
            notFound: true, // Return a 404 page if user is not found
        };
    }
    const userData = querySnapshot.docs[0].data(); // Assuming there's only one user with the given name
    const postData = postsSnapshot.docs.map(doc => {
        const data = doc.data();
        data.createdAt = data.createdAt.toDate().toISOString(); // Convert createdAt to string
        data.comments = data.comments ? JSON.parse(JSON.stringify(data.comments)) : null;
        return data;
    });
    
    // Pass user data to the page via props
    return {
        props: { userData, postData },
        // Re-generate the page at most once per second if a request comes in
        revalidate: 60,
    };
}

 
export default isAuth(User)