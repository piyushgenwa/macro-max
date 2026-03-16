import { UserProfile, DayLog, FoodEntry, Macros } from "@/types";
import { ensureFirebaseUser, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

const KEYS = {
  profile: "macromax_profile",
  logs: "macromax_logs",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const EMPTY_MACROS: Macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };

function emptyDayLog(date: string): DayLog {
  return { date, entries: [], totals: { ...EMPTY_MACROS } };
}

function getLocalProfile(): UserProfile | null {
  if (!isBrowser()) return null;
  const data = localStorage.getItem(KEYS.profile);
  return data ? JSON.parse(data) : null;
}

function saveLocalProfile(profile: UserProfile): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

function getLocalAllLogs(): Record<string, DayLog> {
  if (!isBrowser()) return {};
  const data = localStorage.getItem(KEYS.logs);
  return data ? JSON.parse(data) : {};
}

function saveLocalAllLogs(logs: Record<string, DayLog>): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.logs, JSON.stringify(logs));
}

async function getUserContext(): Promise<{ uid: string | null; dbAvailable: boolean }> {
  const uid = await ensureFirebaseUser();
  return {
    uid,
    dbAvailable: Boolean(uid && getFirebaseDb()),
  };
}

async function migrateLocalDataIfNeeded(uid: string): Promise<void> {
  if (!isBrowser() || !isFirebaseConfigured) return;

  const db = getFirebaseDb();
  if (!db) return;

  const profile = getLocalProfile();
  const logs = getLocalAllLogs();
  const hasLocalData = Boolean(profile) || Object.keys(logs).length > 0;

  if (!hasLocalData) return;

  const migrationRef = doc(db, "users", uid, "meta", "migration");
  const migrationSnap = await getDoc(migrationRef);
  if (migrationSnap.exists()) {
    return;
  }

  if (profile) {
    await setDoc(doc(db, "users", uid, "profile", "main"), profile);
  }

  await Promise.all(
    Object.entries(logs).map(([date, log]) =>
      setDoc(doc(db, "users", uid, "logs", date), {
        date,
        entries: log.entries,
        totals: recalcTotals(log.entries),
      })
    )
  );

  await setDoc(migrationRef, {
    migratedAt: new Date().toISOString(),
    hadProfile: Boolean(profile),
    logCount: Object.keys(logs).length,
  });
}

export async function getProfile(): Promise<UserProfile | null> {
  if (!isFirebaseConfigured) {
    return getLocalProfile();
  }

  const { uid, dbAvailable } = await getUserContext();
  if (!uid || !dbAvailable) {
    return getLocalProfile();
  }

  await migrateLocalDataIfNeeded(uid);

  const db = getFirebaseDb();
  if (!db) {
    return getLocalProfile();
  }

  const profileSnap = await getDoc(doc(db, "users", uid, "profile", "main"));
  return profileSnap.exists() ? (profileSnap.data() as UserProfile) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);

  if (!isFirebaseConfigured) {
    return;
  }

  const { uid, dbAvailable } = await getUserContext();
  if (!uid || !dbAvailable) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) return;

  await setDoc(doc(db, "users", uid, "profile", "main"), profile);
}

function getDayLogFromLogs(logs: Record<string, DayLog>, date: string): DayLog {
  return logs[date] || emptyDayLog(date);
}

export async function getDayLog(date: string): Promise<DayLog> {
  if (!isFirebaseConfigured) {
    return getDayLogFromLogs(getLocalAllLogs(), date);
  }

  const { uid, dbAvailable } = await getUserContext();
  if (!uid || !dbAvailable) {
    return getDayLogFromLogs(getLocalAllLogs(), date);
  }

  await migrateLocalDataIfNeeded(uid);

  const db = getFirebaseDb();
  if (!db) {
    return getDayLogFromLogs(getLocalAllLogs(), date);
  }

  const dayLogSnap = await getDoc(doc(db, "users", uid, "logs", date));
  return dayLogSnap.exists() ? (dayLogSnap.data() as DayLog) : emptyDayLog(date);
}

export async function addFoodEntry(date: string, entry: FoodEntry): Promise<void> {
  const logs = getLocalAllLogs();
  const dayLog = getDayLogFromLogs(logs, date);

  dayLog.entries.push(entry);
  dayLog.totals = recalcTotals(dayLog.entries);
  logs[date] = dayLog;
  saveLocalAllLogs(logs);

  if (!isFirebaseConfigured) {
    return;
  }

  const { uid, dbAvailable } = await getUserContext();
  if (!uid || !dbAvailable) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) return;

  await setDoc(doc(db, "users", uid, "logs", date), dayLog);
}

export async function removeFoodEntry(date: string, entryId: string): Promise<void> {
  const logs = getLocalAllLogs();
  const dayLog = logs[date];
  if (!dayLog) return;

  dayLog.entries = dayLog.entries.filter((e) => e.id !== entryId);
  dayLog.totals = recalcTotals(dayLog.entries);
  logs[date] = dayLog;
  saveLocalAllLogs(logs);

  if (!isFirebaseConfigured) {
    return;
  }

  const { uid, dbAvailable } = await getUserContext();
  if (!uid || !dbAvailable) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) return;

  await setDoc(doc(db, "users", uid, "logs", date), dayLog);
}

function recalcTotals(entries: FoodEntry[]): Macros {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.macros.calories,
      protein: acc.protein + e.macros.protein,
      carbs: acc.carbs + e.macros.carbs,
      fat: acc.fat + e.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export async function getRecentLogs(days: number): Promise<DayLog[]> {
  let logs = getLocalAllLogs();

  if (isFirebaseConfigured) {
    const { uid, dbAvailable } = await getUserContext();
    if (uid && dbAvailable) {
      await migrateLocalDataIfNeeded(uid);

      const db = getFirebaseDb();
      if (db) {
        const logsSnap = await getDocs(query(collection(db, "users", uid, "logs")));
        logs = logsSnap.docs.reduce<Record<string, DayLog>>((acc, logDoc) => {
          const data = logDoc.data() as DayLog;
          acc[data.date] = data;
          return acc;
        }, {});
      }
    }
  }

  const result: DayLog[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    result.push(logs[dateStr] || emptyDayLog(dateStr));
  }

  return result;
}
