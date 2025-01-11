"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface ModalProps {
  openModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ openModal, setShowModal, children, maxWidth }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => setShowModal(false);


  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openModal]);

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed scrollbar-hide [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
        >
          <motion.div
            className="fixed inset-0 h-full w-full bg-black bg-opacity-50 z-40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          ></motion.div>

          <motion.div
            ref={modalRef}
            className={cn(
              " max-h-[80%] bg-white shadow-cartoon-small dark:shadow-cartoon-small-dark border border-black dark:border-white dark:bg-background mx-3 rounded-2xl relative z-50 flex flex-col flex-1 overflow-auto dark:bg-[url('/assets/background/grain-bg.svg')] dark:bg-auto dark:bg-repeat"
              , maxWidth ? `${maxWidth}` : "md:max-w-[50%] xl:max-w-[30%]"
            )}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 dark:text-white z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hover:scale-125 hover:rotate-12 transition duration-200"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col flex-1 py-8 px-6 md:p-10 overflow-y-scroll scrollbar-hide ">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

