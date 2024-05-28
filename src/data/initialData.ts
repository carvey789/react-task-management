import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { Label, Section } from "../types/types";

type Data = {
  sections: Section[];
  labels: Label[];
};

export const data: Data = {
  sections: [
    {
      id: 0,
      sectionId: "0",
      sectionTitle: "Routines 🔁",
      sectionCards: [
        {
          id: uuidv4(),
          cardTitle: "Do a weekly review of my tasks and goals",
          cardPriority: 0,
          cardSectionId: "0",
          cardIsDone: false,
          cardLabels: [
            { labelTitle: "read", labelId: "0" },
            { labelTitle: "write", labelId: "1" },
          ],
          cardChildren: [
            {
              id: uuidv4(),
              cardTitle: "Add more personal routines",
              cardDesc:
                "e.g.: pay taxes yearly, empty the bins weekly, meditate for 10 mins ev weekday at 9am",
              cardDueDate: new Date(),
              cardPriority: 2,
              cardSectionId: "0",
              cardParentId: "0",
              cardIsDone: false,
              cardLabels: [{ labelTitle: "read", labelId: "0" }],
              cardChildren: [
                {
                  id: uuidv4(),
                  cardTitle: "Add more personal routines",
                  cardDesc:
                    "e.g.: pay taxes yearly, empty the bins weekly, meditate for 10 mins ev weekday at 9am",
                  cardDueDate: new Date(),
                  cardPriority: 2,
                  cardSectionId: "0",
                  cardParentId: "1",
                  cardIsDone: false,
                  cardLabels: [{ labelTitle: "read", labelId: "0" }],
                  cardChildren: [],
                  isCollapse: true,
                },
              ],
              isCollapse: true,
            },
          ],
          isCollapse: false,
        },
        {
          id: uuidv4(),
          cardTitle: "Make a Workout Routines",
          cardPriority: 0,
          cardSectionId: "0",
          cardIsDone: false,
          cardLabels: [
            { labelTitle: "read", labelId: "0" },
            { labelTitle: "write", labelId: "1" },
          ],
          cardChildren: [
            {
              id: uuidv4(),
              cardTitle: "Go out with friend",
              cardDesc: "note: bring more money.",
              cardDueDate: dayjs(new Date()).endOf("day").toDate(),
              cardPriority: 2,
              cardSectionId: "0",
              cardParentId: "2",
              cardIsDone: false,
              cardLabels: [{ labelTitle: "read", labelId: "0" }],
              cardChildren: [],
              isCollapse: true,
            },
          ],
          isCollapse: true,
        },
        {
          id: uuidv4(),
          cardTitle: "Make a Workout Routines",
          cardPriority: 0,
          cardSectionId: "0",
          cardIsDone: false,
          cardLabels: [
            { labelTitle: "read", labelId: "0" },
            { labelTitle: "write", labelId: "1" },
          ],
          cardChildren: [
            {
              id: uuidv4(),
              cardTitle: "Go out with friend",
              cardDesc: "note: bring more money.",
              cardDueDate: dayjs(new Date()).endOf("day").toDate(),
              cardPriority: 2,
              cardSectionId: "0",
              cardParentId: "2",
              cardIsDone: false,
              cardLabels: [{ labelTitle: "read", labelId: "0" }],
              cardChildren: [],
              isCollapse: true,
            },
          ],
          isCollapse: true,
        },
      ],
      sectionTotalAllCards: 4,
      isCollapse: false,
    },
    {
      id: 1,
      sectionId: "1",
      sectionTitle: "Inspiration ✨",
      sectionCards: [
        {
          id: uuidv4(),
          cardTitle: "Browse Behance",
          cardPriority: 0,
          cardSectionId: "1",
          cardIsDone: false,
          cardLabels: [
            { labelTitle: "read", labelId: "0" },
            { labelTitle: "write", labelId: "1" },
          ],
          cardChildren: [
            {
              id: uuidv4(),
              cardTitle: "Look in to Social Media",
              cardDesc: "e.g.: youtube, tiktok.",
              cardDueDate: new Date(),
              cardPriority: 2,
              cardSectionId: "0",
              cardParentId: "0",
              cardIsDone: false,
              cardLabels: [{ labelTitle: "read", labelId: "0" }],
              cardChildren: [],
              isCollapse: true,
            },
          ],
          isCollapse: false,
        },
      ],
      sectionTotalAllCards: 2,
      isCollapse: false,
    },
  ],
  labels: [
    {
      labelId: "0",
      labelTitle: "read",
    },
    { labelId: "1", labelTitle: "write" },
  ],
};
