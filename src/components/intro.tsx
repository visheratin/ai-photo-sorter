import React, { useState, useEffect } from "react";

const IntroComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    if (isFirstVisit) {
      setIsOpen(true);
      setIsFirstVisit(false);
    } else {
      setIsOpen(false);
    }
  }, [isFirstVisit]);

  return (
    <>
      <div className="bg-gray-100 p-0 w-full flex items-center justify-center">
        {isOpen && (
          <div className="text-gray-800 sm:w-full lg:w-3/4 px-4  py-4">
            <p>
              Discover a user-friendly web application that helps you organize
              your photo collection securely and efficiently. Create custom
              classes, sort your photos, and eliminate duplicates with the power
              of neural networks, all while keeping your data safe on your own
              computer. Embrace simplicity, privacy, and a seamless photo
              management experience with our innovative app. Give it a try
              today!
            </p>
            <p>
              How it works:
              <ol className="list-decimal list-inside">
                <li>
                  Set the power of the AI and initialize it. The power controls
                  how many CPU cores will be used to process the images. The
                  more cores you have, the faster the processing will be.
                </li>
                <li>
                  Load the photos. Just drag and drop them into the box or click
                  on it. Remember: the photos are not uploaded anywhere, they
                  are processed locally on your computer.
                </li>
                <li>
                  Set the names of the classes. You can scroll the photos to
                  come up with the initial list. You can always refine the
                  classes later.
                </li>
                <li>
                  Click on the &quot;Process&quot; button. The AI will process
                  the photos and sort them into classes. It will also find
                  duplicates and group them.
                </li>
                <li>
                  Review the results. You can mark the photos you don&apos;t
                  want to keep for deletion. You can also rename/add/delete the
                  classes and re-run the processing.
                </li>
                <li>
                  When you are done, click on the &quot;Generate script&quot;
                  button. It will generate a script that you can run on your
                  computer to delete the unwanted photos and move the rest into
                  the appropriate folders. Important: the script assumes that
                  all the photos are in the same folder. If you have them in
                  different folders, you will need to modify the script.
                </li>
              </ol>
            </p>
          </div>
        )}
      </div>
      <div className="bg-gray-100 p-0 w-full flex items-center justify-center border-y-[1px] border-gray-400">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="py-1 px-3 rounded-md focus:outline-none w-full"
        >
          {isOpen ? "Hide" : "Description"}
        </button>
      </div>
    </>
  );
};

export default IntroComponent;
