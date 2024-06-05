import { useEffect } from "react";

import { db } from "./db/db";
import { useStore } from "./stores/stores";
import { SectionComp } from "./components/Section";
import { initDataIndexedDb } from "./utils/indexedDbOp";

function App() {
  const { sections, setSections, labels, setLabels } = useStore();

  useEffect(() => {
    const getIndexeddbData = async () => {
      const indexedSections = await db.sections.orderBy("order").toArray();
      const indexedLabels = await db.labels.toArray();

      setSections(indexedSections);
      setLabels(indexedLabels);
    };

    if (sections.length === 0 && labels.length === 0) {
      initDataIndexedDb().then(getIndexeddbData);
    }
  }, [labels.length, sections.length, setLabels, setSections]);

  return (
    <div className="relative">
      <div className="h-screen max-w-[50%] mx-auto pb-10">
        {sections.map((section) => (
          <SectionComp key={section.sectionId} section={section} />
        ))}
      </div>
    </div>
  );
}

export default App;
