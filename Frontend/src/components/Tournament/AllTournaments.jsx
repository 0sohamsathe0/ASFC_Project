import { useEffect, useState } from "react";
import axios from "axios";
import TournamentTable from "./TournamentTable";
import EditTournamentModal from "./EditTournamentModal";

const AllTournaments = () => {
  const adminToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

  const [tournaments, setTournaments] = useState({
    upcoming: [],
    ongoing: [],
    completed: [],
  });

  const [selectedTournament, setSelectedTournament] = useState(null);
  
  const fetchTournaments = async () => {
  const res = await axios.get("http://localhost:5050/tournament",{
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

  const data = res.data.data;

  const grouped = {
    upcoming: [],
    ongoing: [],
    completed: [],
  };

  const today = new Date();

  data.forEach((t) => {
    const start = new Date(t.startingDate);
    const end = new Date(t.endDate);

    if (today < start) {
      grouped.upcoming.push(t);
    } else if (today >= start && today <= end) {
      grouped.ongoing.push(t);
    } else {
      grouped.completed.push(t);
    }
  });

  setTournaments(grouped);
};

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Tournament Management</h1>

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