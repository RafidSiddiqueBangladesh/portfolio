import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { fadeIn } from "../../variants";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    emailjs
      .sendForm(
        "service_16v1d6u",    // replace with your Service ID
        "template_imss55l",   // replace with your Template ID
        formRef.current,
        "ISXu5UstRNWeMsAo7"     // replace with your Public Key
      )
      .then(
        () => {
          alert("✅ Thank you. I will get back to you ASAP.");
          formRef.current.reset();
        },
        (error) => {
          console.log(error.text);
          alert("❌ Oops, something went wrong. Please try again.");
        }
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="h-full bg-primary/30">
      <div className="container mx-auto py-32 text-center xl:text-left flex items-center justify-center h-full">
        <div className="flex flex-col w-full max-w-[700px]">
          <motion.h2
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h2 text-center mb-12"
          >
            Let's <span className="text-accent">connect.</span>
          </motion.h2>

          <motion.form
            ref={formRef}
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex-1 flex flex-col gap-6 w-full mx-auto"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="flex gap-x-6 w-full">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input"
                disabled={isLoading}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="input"
                disabled={isLoading}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="input"
              disabled={isLoading}
              required
            />
            <textarea
              name="message"
              placeholder="Message..."
              className="textarea"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              className="btn rounded-full border border-white/50 max-w-[170px] px-8 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-accent group"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span className="group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500">
                    Let's talk
                  </span>
                  <BsArrowRight
                    className="-translate-y-[120%] opacity-0 group-hover:flex group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]"
                  />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;