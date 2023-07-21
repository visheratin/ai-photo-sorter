"use client";

import { useRef, useState } from "react";
import PhotoGallery from "@/components/gallery";
import { FileInfo } from "@/components/fileInfo";
import { NavbarComponent } from "../../components/navbar";
import { ClassData } from "@/components/classData";
import {
  ZeroShotClassificationModel,
  ZeroShotResult,
} from "@visheratin/web-ai/multimodal";
import { ClassificationPrediction } from "@visheratin/web-ai/image";
import FileLoader from "@/components/fileLoader";
import CodeSnippetModal from "@/components/codeSnippet";
import IntroComponent from "@/components/intro";
import FooterComponent from "@/components/footer";
import ClassSelector from "@/components/classSelector";

export default function Home() {
  const [classNames, setClassNames] = useState<string[]>([]);

  const [unsortedFiles, setUnsortedFiles] = useState<FileInfo[]>([]);

  const [files, setFiles] = useState<FileInfo[]>([]);

  const [classFiles, setClassFiles] = useState<ClassData[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [unixScript, setUnixScript] = useState("");

  const [winScript, setWinScript] = useState("");

  const toStop = useRef(false);

  const [movingFile, setMovingFile] = useState<FileInfo | undefined>();

  const [showMoveModal, setShowMoveModal] = useState(false);

  const setNewFiles = (newFiles: FileInfo[]) => {
    const existingFiles = files.map((file) => file.hash);
    const filteredNewFiles = newFiles.filter(
      (file) => !existingFiles.includes(file.hash)
    );
    setUnsortedFiles((prevFiles: FileInfo[]) => {
      return [...prevFiles, ...filteredNewFiles];
    });
    setFiles((prevFiles: FileInfo[]) => {
      return [...prevFiles, ...filteredNewFiles];
    });
  };

  const [model, setModel] = useState<ZeroShotClassificationModel>();

  const processFiles = async (
    power: number,
    setStatus: (status: {
      progress: number;
      busy: boolean;
      message: string;
    }) => void
  ) => {
    if (!model) {
      setStatus({ busy: false, progress: 0, message: "Model was not loaded!" });
      setTimeout(() => {
        setStatus({
          busy: false,
          progress: 0,
          message: "Waiting for the model",
        });
      }, 2000);
      return;
    }
    const classes = [...classNames];
    if (
      classes.length === 0 ||
      classes.filter((c) => c.length > 0).length === 0
    ) {
      setStatus({
        busy: false,
        progress: 0,
        message: "No classes were set!",
      });
      return;
    }
    const newClasses = classes.map((name): ClassData => {
      return {
        name: name,
        files: [],
        duplicates: [],
      };
    });
    setStatus({ progress: 0, busy: true, message: "Processing..." });
    const start = performance.now();
    const batch = power;
    const dataFiles = [...files];
    setUnsortedFiles([...files]);
    for (let i = 0; i < dataFiles.length; i += batch) {
      setStatus({
        busy: true,
        message: "Processing...",
        progress: (i / dataFiles.length) * 100,
      });
      const toProcessFiles = dataFiles.slice(i, i + batch);
      const toProcess = toProcessFiles.map((file) => file.src);
      const result = (await model.process(
        toProcess,
        classes
      )) as ZeroShotResult;
      if (toProcess.length === 1) {
        const prediction = result.results as ClassificationPrediction[];
        processResult(
          toProcessFiles[0],
          prediction,
          result.imageFeatures[0],
          newClasses,
          classes
        );
      } else {
        const predictions = result.results as ClassificationPrediction[][];
        predictions.forEach((pred, index) => {
          const prediction = pred as ClassificationPrediction[];
          processResult(
            toProcessFiles[index],
            prediction,
            result.imageFeatures[index],
            newClasses,
            classes
          );
        });
      }
      if (toStop.current) {
        setStatus({
          progress: 0,
          busy: false,
          message: "Stopped",
        });
        toStop.current = false;
        return;
      }
    }
    const end = performance.now();
    const elapsed = Math.round((end - start) / 10) / 100;
    setStatus({
      progress: 100,
      busy: false,
      message: `Finished in ${elapsed}s`,
    });
    findDuplicates(newClasses);
  };

  const processResult = (
    file: FileInfo,
    result: ClassificationPrediction[],
    embedding: number[],
    classData: ClassData[],
    classes: string[]
  ) => {
    file.classPredictions = result;
    if (result.length === 0) {
      return;
    }
    if (result[0].confidence < 0.5) {
      return;
    }
    file.embedding = embedding;
    const foundClass = result[0].class;
    const foundClassIndex = classes.indexOf(foundClass);
    classData[foundClassIndex].files.push(file);
    setClassFiles([...classData]);
    setUnsortedFiles((prevFiles: FileInfo[]) => {
      const unsortedIdx = prevFiles.indexOf(file);
      prevFiles.splice(unsortedIdx, 1);
      return [...prevFiles];
    });
    return;
  };

  const cosineSim = (vector1: number[], vector2: number[]) => {
    let dotproduct = 0;
    let m1 = 0;
    let m2 = 0;
    for (let i = 0; i < vector1.length; i++) {
      dotproduct += vector1[i] * vector2[i];
      m1 += vector1[i] * vector1[i];
      m2 += vector2[i] * vector2[i];
    }
    m1 = Math.sqrt(m1);
    m2 = Math.sqrt(m2);
    const sim = dotproduct / (m1 * m2);
    return sim;
  };

  const findDuplicates = async (clsFiles: ClassData[]) => {
    const result: ClassData[] = [];
    clsFiles.forEach((classData: ClassData) => {
      const files = classData.files;
      const duplicates: FileInfo[][] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let dupeFound = false;
        for (let j = 0; j < duplicates.length; j++) {
          const dupes = duplicates[j];
          for (let k = 0; k < dupes.length; k++) {
            const dupe = dupes[k];
            const sim = cosineSim(
              file.embedding as number[],
              dupe.embedding as number[]
            );
            if (sim > 0.9) {
              dupes.push(file);
              files.splice(i, 1);
              dupeFound = true;
              break;
            }
          }
          if (dupeFound) {
            break;
          }
        }
        if (dupeFound) {
          i--;
          continue;
        }
        for (let j = i + 1; j < files.length; j++) {
          const file2 = files[j];
          const sim = cosineSim(
            file.embedding as number[],
            file2.embedding as number[]
          );
          if (sim > 0.9) {
            const dupe: FileInfo[] = [file, file2];
            duplicates.push(dupe);
            files.splice(j, 1);
            files.splice(i, 1);
            i--;
            break;
          }
        }
      }
      classData.duplicates = [];
      for (let i = 0; i < duplicates.length; i++) {
        const dupes = duplicates[i];
        if (dupes.length > 1) {
          classData.duplicates.push({
            name: `Possible duplicate ${i}`,
            files: dupes,
            duplicates: [],
          });
        }
      }
      result.push(classData);
    });
    setClassFiles([...result]);
  };

  const markDeleted = (hash: string) => {
    const clsFiles = [...classFiles];
    for (let i = 0; i < clsFiles.length; i++) {
      const cls = clsFiles[i];
      for (let j = 0; j < cls.files.length; j++) {
        const file = cls.files[j];
        if (file.hash === hash) {
          file.toDelete = !file.toDelete;
          setClassFiles(clsFiles);
          return;
        }
      }
      for (let j = 0; j < cls.duplicates.length; j++) {
        const dupes = cls.duplicates[j];
        for (let k = 0; k < dupes.files.length; k++) {
          const file = dupes.files[k];
          if (file.hash === hash) {
            file.toDelete = !file.toDelete;
            setClassFiles(clsFiles);
            return;
          }
        }
      }
    }
    const unsorted = [...unsortedFiles];
    for (let i = 0; i < unsorted.length; i++) {
      const file = unsorted[i];
      if (file.hash === hash) {
        file.toDelete = !file.toDelete;
        setUnsortedFiles(unsorted);
        return;
      }
    }
  };

  const generateScript = () => {
    const unixCommands: string[] = [];
    const winCommands: string[] = [];
    const unsorted = unsortedFiles.filter((f) => f.toDelete);
    for (let i = 0; i < unsorted.length; i++) {
      const file = unsorted[i];
      unixCommands.push(`rm "${file.name}"`);
      winCommands.push(`del /q "${file.name}"`);
    }
    const clsFiles = [...classFiles];
    for (let i = 0; i < clsFiles.length; i++) {
      unixCommands.push(`mkdir "${clsFiles[i].name}"`);
      winCommands.push(`mkdir "${clsFiles[i].name}"`);
      const cls = clsFiles[i];
      for (let j = 0; j < cls.files.length; j++) {
        const file = cls.files[j];
        if (file.toDelete) {
          unixCommands.push(`rm "${file.name}"`);
          winCommands.push(`del /q "${file.name}"`);
        } else {
          unixCommands.push(`mv "${file.name}" "${cls.name}"/`);
          winCommands.push(`move "${file.name}" "${cls.name}"/`);
        }
      }
      for (let j = 0; j < cls.duplicates.length; j++) {
        const dupes = cls.duplicates[j];
        for (let k = 0; k < dupes.files.length; k++) {
          const file = dupes.files[k];
          if (file.toDelete) {
            unixCommands.push(`rm "${file.name}"`);
            winCommands.push(`del /q "${file.name}"`);
          } else {
            unixCommands.push(`mv "${file.name}" "${cls.name}"/`);
            winCommands.push(`move "${file.name}" "${cls.name}"/`);
          }
        }
      }
    }
    const unixScript = unixCommands.join("\n");
    const winScript = winCommands.join("\n");
    setUnixScript(unixScript);
    setWinScript(winScript);
    setModalOpen(true);
  };

  const stopProcessing = () => {
    console.log("Stopping processing");
    toStop.current = true;
  };

  const startFileMoving = (file: FileInfo | undefined) => {
    setMovingFile(file);
    setShowMoveModal(true);
  };

  const moveToClass = (file: FileInfo, clsName: string) => {
    console.log(`Moving ${file.name} to ${clsName}`);
    const clsFiles = [...classFiles];
    let currentClass = "";
    for (let i = 0; i < clsFiles.length; i++) {
      const cls = clsFiles[i];
      if (cls.files.includes(file)) {
        currentClass = cls.name;
        break;
      }
      for (let j = 0; j < cls.duplicates.length; j++) {
        const dupes = cls.duplicates[j];
        if (dupes.files.includes(file)) {
          currentClass = cls.name;
          break;
        }
      }
    }
    if (currentClass === clsName) {
      return;
    }
    for (let i = 0; i < clsFiles.length; i++) {
      const cls = clsFiles[i];
      if (cls.name === clsName) {
        cls.files.push(file);
        continue;
      }
      if (cls.files.includes(file)) {
        cls.files.splice(cls.files.indexOf(file), 1);
        continue;
      }
      for (let j = 0; j < cls.duplicates.length; j++) {
        const dupes = cls.duplicates[j];
        if (dupes.files.includes(file)) {
          dupes.files.splice(dupes.files.indexOf(file), 1);
          continue;
        }
      }
    }
    setClassFiles(clsFiles);
    for (let i = 0; i < unsortedFiles.length; i++) {
      const unsorted = unsortedFiles[i];
      if (unsorted === file) {
        unsortedFiles.splice(i, 1);
        break;
      }
    }
    setUnsortedFiles(unsortedFiles);
  };

  return (
    <>
      <header className="text-center py-6 bg-blue-600 moving-gradient">
        <h1 className="text-4xl font-semibold">AI photo organizer</h1>
        <h5 className="text-xl text-white-600 mt-2">
          Organize your photos using the power of neural networks
        </h5>
      </header>
      <IntroComponent />
      <div className="flex flex-col lg:flex-row flex-grow min-h-screen">
        <NavbarComponent
          onInputChange={setClassNames}
          modelCallback={setModel}
          process={processFiles}
          classNum={classNames.filter((c) => c.length > 0).length}
          generateScript={generateScript}
          stopProcessing={stopProcessing}
        />
        <div className="border-l border-gray-300 h-auto my-2"></div>
        <main className="flex-grow p-6 lg:w-80 lg:h-full">
          <section>
            <FileLoader setNewFiles={setNewFiles} />
          </section>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          {classFiles.length > 0 &&
            classFiles.map(
              (item) =>
                (item.files.length > 0 || item.duplicates.length > 0) && (
                  <section
                    key={item.name}
                    className="rounded-md border border-blue-400 p-4 my-4"
                  >
                    <h3 className="mb-4 text-xl font-semibold">{item.name}</h3>
                    <PhotoGallery
                      images={item.files}
                      duplicates={item.duplicates}
                      markDeleted={markDeleted}
                      moveToClass={startFileMoving}
                    />
                  </section>
                )
            )}
          {unsortedFiles.length > 0 && (
            <section className="rounded-md border border-blue-400 p-4">
              <h3 className="mb-4 text-xl font-semibold">Unsorted</h3>
              <PhotoGallery
                images={unsortedFiles}
                duplicates={[]}
                markDeleted={markDeleted}
                moveToClass={startFileMoving}
              />
            </section>
          )}
        </main>
      </div>
      <FooterComponent />
      <CodeSnippetModal
        unixCode={unixScript}
        windowsCode={winScript}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <ClassSelector
        classes={classNames}
        onClassSet={moveToClass}
        file={movingFile}
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
      />
    </>
  );
}
