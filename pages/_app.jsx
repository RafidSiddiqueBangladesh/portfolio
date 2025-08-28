import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import Transition from "../components/Transition";
import ChatWidget from "../components/ChatWidget";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={router.route} className="h-full">
          <Transition />
          <Component {...pageProps} />
             <ChatWidget apiKey={process.env.NEXT_PUBLIC_GEMAI_API_KEY} /> 
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default MyApp;
