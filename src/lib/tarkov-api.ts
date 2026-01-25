import { request, gql } from 'graphql-request';

const API_ENDPOINT = 'https://api.tarkov.dev/graphql';

export interface Item {
  id: string;
  name: string;
  shortName: string;
  image512pxLink: string;
}

export interface TaskObjective {
  type: string;
  item?: Item;
  count?: number;
  foundInRaid?: boolean;
}

export interface Task {
  id: string;
  name: string;
  trader: {
    name: string;
  };
  objectives: TaskObjective[];
}

export interface HideoutStation {
  id: string;
  name: string;
  levels: {
    level: number;
    itemRequirements: {
      item: Item;
      count: number;
    }[];
  }[];
}

const GET_TASKS_QUERY = gql`
  query GetTasks($lang: LanguageCode) {
    tasks(lang: $lang) {
      id
      name
      trader {
        name
      }
      objectives {
        ... on TaskObjectiveItem {
          type
          item {
            id
            name
            shortName
            image512pxLink
          }
          count
          foundInRaid
        }
      }
    }
  }
`;

const GET_HIDEOUT_QUERY = gql`
  query GetHideout($lang: LanguageCode) {
    hideoutStations(lang: $lang) {
      id
      name
      levels {
        level
        itemRequirements {
          item {
            id
            name
            shortName
            image512pxLink
          }
          count
        }
      }
    }
  }
`;

export async function getTasks(lang: string = 'en'): Promise<Task[]> {
  try {
    const data = await request<{ tasks: Task[] }>(API_ENDPOINT, GET_TASKS_QUERY, { lang });
    // Filter tasks that have item requirements and clean up objectives
    return data.tasks
      .map(task => ({
        ...task,
        objectives: task.objectives.filter(obj => (obj.type === 'giveItem' || obj.type === 'findItem') && obj.item)
      }))
      .filter(task => task.objectives.length > 0);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function getHideoutStations(lang: string = 'en'): Promise<HideoutStation[]> {
  try {
    const data = await request<{ hideoutStations: HideoutStation[] }>(API_ENDPOINT, GET_HIDEOUT_QUERY, { lang });
    return data.hideoutStations;
  } catch (error) {
    console.error('Error fetching hideout stations:', error);
    return [];
  }
}

const GET_ITEMS_BY_IDS_QUERY = gql`
  query GetItemsByIds($ids: [ID!]!, $lang: LanguageCode) {
    items(ids: $ids, lang: $lang) {
      id
      name
      shortName
      iconLink
    }
  }
`;

export async function getItemsByIds(ids: string[], lang: string = 'en'): Promise<Item[]> {
  try {
    const data = await request<{ items: Item[] }>(API_ENDPOINT, GET_ITEMS_BY_IDS_QUERY, { ids, lang });
    return data.items;
  } catch (error) {
    console.error('Error fetching items by IDs:', error);
    return [];
  }
}
