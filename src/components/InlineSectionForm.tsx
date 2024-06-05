import { useEffect, useState } from "react";
import { useStore } from "../stores/stores";
import { v4 as uuidv4 } from "uuid";
import { Section } from "../types/types";
import { db } from "../db/db";

export const InlineSectionForm = ({ sectionId }: { sectionId: string }) => {
  const { isAddingSection, setAddingSection, sections, setSections } = useStore(
    (state) => state
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const section: Section = {
      sectionId: uuidv4(),
      sectionTitle: inputValue,
      sectionCards: [],
      isCollapse: true,
    };

    try {
      const newId = await db.sections.add(section);
      const newSections = [...sections];
      const indexOfSection = newSections
        .map((section) => section.sectionId)
        .indexOf(sectionId);
      newSections.splice(indexOfSection + 1, 0, section);
      const newSectionOrder = newSections.map((section, idx) => ({
        ...section,
        order: idx,
        id: section.id || newId,
      }));

      const tobeUpdateBulkSection = newSectionOrder.map((section) => ({
        key: section.id,
        changes: {
          order: section.order,
        },
      }));

      await db.sections.bulkUpdate(tobeUpdateBulkSection);

      setSections(newSectionOrder);

      setIsFormOpen(false);
      setAddingSection(false);
    } catch {
      console.error("Failed to add section.");
    }
  };

  useEffect(() => {
    if (!isFormOpen) {
      setInputValue("");
      setAddingSection(false);
    } else {
      setAddingSection(true);
    }
  }, [isFormOpen, setAddingSection]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className={`${
          isAddingSection ? "opacity-0 pointer-events-none" : "flex"
        } pl-7 w-full py-2 items-center opacity-0 transition-all text-sm font-bold border-none text-red-accent hover:opacity-100 before:mr-[10px] before:bg-red-accent before:content-[''] before:block before:h-[1px] before:opacity-50 before:flex-auto after:ml-[10px] after:bg-red-accent after:content-[''] after:block after:h-[1px] after:opacity-50 after:flex-auto`}
      >
        Add Section
      </button>
      <form className={`${isFormOpen ? "block text-sm mb-9 pl-7" : "hidden"}`}>
        <input
          type="text"
          name="sectionTitle"
          placeholder="Name this section"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-black/10 w-full rounded-md px-2 py-1 text-black/80 font-bold placeholder:text-black/40"
        />
        <div className="mt-2 flex gap-2">
          <button
            className="px-2 py-1 rounded-md bg-red-600 font-semibold text-white hover:bg-red-accent disabled:bg-red-accent/20"
            type="submit"
            onClick={handleSubmit}
          >
            Add section
          </button>
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-2 py-1 rounded-md bg-transparent font-semibold text-black/80 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
