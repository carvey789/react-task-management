import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { db } from "./db/db";
import { useStore } from "./stores/stores";
import { SectionComp } from "./components/Section";
import { Section } from "./types/types";

function App() {
  const { sections, setSections, setLabels } = useStore();
  const [sectionName, setSectionName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(e.target.value);
  };

  const handleSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const section: Section = {
      id: 0,
      sectionId: uuidv4(),
      sectionTitle: sectionName,
      sectionCards: [],
      isCollapse: false,
      order: 0,
    };

    const newSections = [...sections, section];
    setSections(newSections);
    setSectionName("");
    await db.sections.add(section, "id");
  };

  useEffect(() => {
    const getIndexeddbData = async () => {
      const indexedSections = await db.sections.orderBy("order").toArray();
      const indexedLabels = await db.labels.toArray();

      setSections(indexedSections);
      setLabels(indexedLabels);
    };

    getIndexeddbData();
  }, [setLabels, setSections]);

  return (
    <div className="relative w-full">
      <p className="text-center text-2xl py-8 text-black/80">
        👾 React Task Management
      </p>
      {!sections.length && (
        <div className="w-1/2 max-w-[500px] mx-auto text-sm bg-white rounded-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4">
          <h1 className="text-md mb-2">
            There is no section. Add your first section!
          </h1>
          <form className="block text-sm">
            <input
              type="text"
              name="sectionTitle"
              placeholder="Name this section"
              value={sectionName}
              onChange={handleInputChange}
              className="border border-black/10 w-full rounded-md px-2 py-1 text-black/80 font-bold placeholder:text-black/40"
            />
            <div className="mt-2 flex gap-2">
              <button
                className="px-2 py-1 rounded-md bg-red-600 font-semibold text-white hover:bg-red-accent disabled:bg-red-accent/20"
                type="submit"
                onClick={handleSubmitSection}
              >
                Add section
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="h-screen max-w-[50%] mx-auto pb-10">
        {sections.map((section) => (
          <SectionComp key={section.sectionId} section={section} />
        ))}
      </div>
    </div>
  );
}

export default App;
