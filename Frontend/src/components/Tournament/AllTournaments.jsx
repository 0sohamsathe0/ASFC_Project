import { useEffect, useState } from "react";
import TournamentTable from "./TournamentTable";
import EditTournamentModal from "./EditTournamentModal";
import { api } from "../api";

const groupTournamentsBySchedule = (data) => {
  const grouped = { upcoming: [], ongoing: [], completed: [] };
  const today = new Date();

  data.forEach((tournament) => {
    const start = new Date(tournament.startingDate);
    const end = new Date(tournament.endDate);

    if (today < start) {
      grouped.upcoming.push(tournament);
    } else if (today >= start && today <= end) {
      grouped.ongoing.push(tournament);
    } else {
      grouped.completed.push(tournament);
    }
  });

  return grouped;
};

const AllTournaments = () => {
  const [tournaments, setTournaments] = useState({
    upcoming: [],
    ongoing: [],
    completed: [],
  });

  const [selectedTournament, setSelectedTournament] = useState(null);
  
  const fetchTournaments = async () => {
    const res = await api.get("/tournament");
    setTournaments(groupTournamentsBySchedule(res.data.data));
  };

  useEffect(() => {
    api.get("/tournament").then((res) => {
      setTournaments(groupTournamentsBySchedule(res.data.data));
    });
  }, []);

  return (
    <div className="min-h-full bg-slate-900 p-4 text-white sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Tournaments
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          Tournament Management
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Review and update tournaments by their current schedule.
        </p>
      </div>

      <div className="space-y-6">
        <TournamentTable
          title="Upcoming"
          data={tournaments.upcoming}
          onEdit={setSelectedTournament}
        />

        <TournamentTable
          title="Ongoing"
          data={tournaments.ongoing}
          onEdit={setSelectedTournament}
        />

        <TournamentTable
          title="Completed"
          data={tournaments.completed}
          onEdit={setSelectedTournament}
        />
      </div>

      {selectedTournament && (
        <EditTournamentModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          refresh={fetchTournaments}
        />
      )}
    </div>
  );
};

export default AllTournaments;
