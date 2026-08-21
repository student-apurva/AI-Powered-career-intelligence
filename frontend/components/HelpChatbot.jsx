import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaCompass,
  FaSpinner,
  FaFileAlt,
  FaChartLine,
  FaBriefcase,
  FaGraduationCap,
  FaUser,
  FaMagic,
  FaStar
} from "react-icons/fa";

import "../src/styles/HelpChatbot.css";

const API_URL = "http://localhost:8000";

export default function HelpChatbot() {

  const navigate = useNavigate();
  const location = useLocation();

  const messagesEndRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Hi! 👋 I'm your Ascendra AI Assistant. I can help you navigate the platform and understand its features."
    }
  ]);


  // =====================================================
  // CURRENT PAGE
  // =====================================================

  const getCurrentPage = () => {

    const pages = {

      "/dashboard-analytics":
        "Dashboard",

      "/profile":
        "Profile",

      "/resume-builder":
        "Resume Builder",

      "/resume-improvement":
        "Resume Improvement",

      "/analyze":
        "ATS Analysis",

      "/career-recom":
        "Career Recommendation",

      "/job-recommendations":
        "Job Recommendation",

      "/courses":
        "Courses"

    };

    return (
      pages[location.pathname] ||
      "Ascendra AI"
    );
  };


  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages, loading]);


  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (target) => {

    if (!target) {
      return;
    }

    navigate(target);

  };


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async (customMessage = null) => {

    const text = (
      customMessage !== null
        ? customMessage
        : input
    ).trim();

    if (!text || loading) {
      return;
    }


    // USER MESSAGE

    setMessages((previous) => [

      ...previous,

      {
        id: Date.now(),
        sender: "user",
        text: text
      }

    ]);

    setInput("");

    setLoading(true);


    try {

      const token =
        localStorage.getItem("token");


      const response = await axios.post(

        `${API_URL}/api/chatbot`,

        {
          message: text,

          current_page:
            getCurrentPage(),

          current_path:
            location.pathname
        },

        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`
              }
            : {}
        }

      );


      const data =
        response.data;


      setMessages((previous) => [

        ...previous,

        {
          id:
            Date.now() + 1,

          sender:
            "bot",

          text:
            data.message ||
            "I'm here to help you.",

          action:
            data.action ||
            null,

          target:
            data.target ||
            null,

          action_label:
            data.action_label ||
            "Open Page"
        }

      ]);


    } catch (error) {

      console.error(
        "Chatbot error:",
        error
      );


      setMessages((previous) => [

        ...previous,

        {
          id:
            Date.now() + 1,

          sender:
            "bot",

          text:
            "Sorry, I couldn't connect to the AI assistant right now. Please try again."
        }

      ]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  };


  // =====================================================
  // QUICK QUESTIONS
  // =====================================================

 const getQuickQuestions = () => {

  const path = location.pathname;

  if (path === "/resume-builder") {
    return [
      {
        icon: <FaUser />,
        label: "Personal Details",
        message: "How should I add my personal details?"
      },
      {
        icon: <FaGraduationCap />,
        label: "Education",
        message: "How do I add my education?"
      },
      {
        icon: <FaBriefcase />,
        label: "Experience",
        message: "How do I add my experience?"
      },
      {
        icon: <FaMagic />,
        label: "Improve Resume",
        message: "How can I improve my resume?"
      }
    ];
  }

  if (path === "/analyze") {
    return [
      {
        icon: <FaChartLine />,
        label: "ATS Score",
        message: "What does my ATS score mean?"
      },
      {
        icon: <FaFileAlt />,
        label: "Upload Resume",
        message: "How do I upload my resume for ATS analysis?"
      },
      {
        icon: <FaBriefcase />,
        label: "Job Description",
        message: "Why should I add a job description?"
      }
    ];
  }

  if (path === "/profile") {
    return [
      {
        icon: <FaUser />,
        label: "Update Profile",
        message: "How can I update my profile?"
      },
      {
        icon: <FaFileAlt />,
        label: "Resume",
        message: "How can I upload my resume?"
      }
    ];
  }

  if (path === "/job-recommendations") {
    return [
      {
        icon: <FaBriefcase />,
        label: "Find Jobs",
        message: "How do job recommendations work?"
      },
      {
        icon: <FaStar />,
        label: "Save Job",
        message: "How can I save a job?"
      }
    ];
  }

  if (path === "/courses") {
    return [
      {
        icon: <FaGraduationCap />,
        label: "Find Courses",
        message: "How can I find a suitable course?"
      },
      {
        icon: <FaStar />,
        label: "Recommendations",
        message: "How are courses recommended to me?"
      }
    ];
  }

  if (path === "/career-recom") {
    return [
      {
        icon: <HiSparkles />,
        label: "Career Path",
        message: "How does career recommendation work?"
      },
      {
        icon: <FaBriefcase />,
        label: "Career Options",
        message: "Which career options are suitable for me?"
      }
    ];
  }

  // Dashboard

  return [
    {
      icon: <FaFileAlt />,
      label: "Resume Builder",
      message: "How can I build my resume?"
    },
    {
      icon: <FaChartLine />,
      label: "ATS Analysis",
      message: "How can I check my ATS score?"
    },
    {
      icon: <FaBriefcase />,
      label: "Find Jobs",
      message: "How can I find jobs?"
    },
    {
      icon: <FaGraduationCap />,
      label: "Courses",
      message: "Where can I find courses?"
    }
  ];
};
const quickQuestions = getQuickQuestions();

  return (

    <>

      {/* =================================================
          FLOATING BUTTON
      ================================================= */}

      {!isOpen && (

        <button
          type="button"
          className="help-chatbot-button"
          onClick={() =>
            setIsOpen(true)
          }
          aria-label="Open Ascendra AI Assistant"
        >

          <FaRobot />

          <span className="chatbot-online-dot"></span>

        </button>

      )}


      {/* =================================================
          CHAT WINDOW
      ================================================= */}

      {isOpen && (

        <div className="help-chatbot-window">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="chatbot-header">

            <div className="chatbot-header-left">

              <div className="chatbot-avatar">

                <FaRobot />

              </div>


              <div>

                <h3>
                  Ascendra Assistant
                </h3>

                <span className="chatbot-status">

                  <span></span>

                  Online

                </span>

              </div>

            </div>


            <button
              type="button"
              className="chatbot-close"
              onClick={() =>
                setIsOpen(false)
              }
              aria-label="Close chatbot"
            >

              <FaTimes />

            </button>

          </div>


          {/* =================================================
              CURRENT PAGE
          ================================================= */}

          <div className="chatbot-context">

            <FaCompass />

            <span>

              You're on

              <strong>
                {getCurrentPage()}
              </strong>

            </span>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="chatbot-messages">

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? "chat-message user"
                    : "chat-message bot"
                }
              >


                {/* BOT AVATAR */}

                {message.sender === "bot" && (

                  <div className="message-avatar">

                    <FaRobot />

                  </div>

                )}


                <div className="message-body">

                  <div className="message-text">

                    {message.text}

                  </div>


                  {/* NAVIGATION BUTTON */}

                  {message.action ===
                    "navigate" &&
                    message.target && (

                    <button
                      type="button"
                      className="chat-navigation-button"
                      onClick={() =>
                        handleNavigation(
                          message.target
                        )
                      }
                    >

                      <FaStar />

                      {message.action_label ||
                        "Open Page"}

                    </button>

                  )}

                </div>

              </div>

            ))}


            {/* =================================================
                TYPING
            ================================================= */}

            {loading && (

              <div className="chat-message bot">

                <div className="message-avatar">

                  <FaRobot />

                </div>


                <div className="chatbot-typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}


            <div
              ref={messagesEndRef}
            />

          </div>


          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          {messages.length === 1 && (   

            <div className="chatbot-quick-help">

              <div className="quick-help-title">

                <FaMagic />

                <span>
                  Quick Help
                </span>

              </div>


              <div className="quick-help-grid">

                {quickQuestions.map(
                  (question, index) => (

                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      sendMessage(
                        question.message
                      )
                    }
                  >

                    {question.icon}

                    <span>
                      {question.label}
                    </span>

                  </button>

                ))}

              </div>

            </div>

          )}


          {/* =================================================
              INPUT
          ================================================= */}

          <div className="chatbot-input">

            <textarea
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              disabled={loading}
            />


            <button
              type="button"
              onClick={() =>
                sendMessage()
              }
              disabled={
                !input.trim() ||
                loading
              }
              aria-label="Send message"
            >

              {loading ? (

                <FaSpinner className="chatbot-spinner" />

              ) : (

                <FaPaperPlane />

              )}

            </button>

          </div>


          <div className="chatbot-footer">

            Powered by Ascendra AI

          </div>

        </div>

      )}

    </>

  );

}