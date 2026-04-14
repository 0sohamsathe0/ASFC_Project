import React, { useEffect, useState } from 'react'
import axios from "axios"
function TournamentEntry() {

  const [tournaments, setTournaments] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [filteredPlayers, setFilteredPlayer] = useState([])

  const adminToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken="))
    ?.split("=")[1];

  const fetchTournaments = async () => {
    let result = await axios.get("http://localhost:5050/tournament", {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    })
    console.log(result.data.data)
    setTournaments(result.data.data)
  }
  const fetchPlayers = async () => {
    let result = await axios.get("http://localhost:5050/player/getAllPlayers?status=Accepted", {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    })
    console.log(result.data.data)
    setPlayers(result.data.data)

  }

  const calculateAge = (birthdate) => {
    const today = new Date();
    const dob = new Date(birthdate);

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    // adjust if birthday hasn't come yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  const filterPlayers = async (ageLimit) => {
    const filtered = players.filter((player) => {
      const age = calculateAge(player.dob);
      return age <= ageLimit;
    });
    console.log(filtered)
    setFilteredPlayer(filtered);
  }


  useEffect(() => {
    fetchTournaments()
    fetchPlayers()
  }, [])

  useEffect(() => {

    console.log(selectedTournament)
    filterPlayers(selectedTournament)

  }, [selectedTournament])


  return (
    <div className='p-6 bg-slate-900 min-h-screen text-white'>
      <h1 className='text-amber-300 text-2xl'>Create Entry</h1>
      <br />
      <h1>Select Tournament To create Entry : </h1>
      <select className=" bg-slate-900 border-amber-200" name="" id="" value={selectedTournament || "Select"}
        onChange={(e) => {
          setSelectedTournament(e.target.value)
          console.log(selectedTournament)
        }}>
        <option value="" disabled>Select Tournament</option>
        {
          tournaments.map((tournament) => (
            <option key={tournament._id} value={tournament.ageCategory}> {tournament.title} </option>
          ))
        }
      </select>

      <div className="p-4">
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200 text-black">
            {/* ✅ Select All */}
            <th className="border p-2 text-center">
              <input
                type="checkbox"
                checked={
                  players.length > 0 &&
                  filteredPlayers.length === players.length
                }
              />
            </th>

            <th className="border p-2">Name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Event</th>
            <th className="border p-2">Date Of Birth</th>
          </tr>
        </thead>

        <tbody>
          {filteredPlayers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No players found
              </td>
            </tr>
          ) : (
            filteredPlayers.map((player) => {
              const birtdate = new Date(player.dob)
              const bd = birtdate.getDate() + " / "+birtdate.getMonth()+" / "+birtdate.getFullYear()
              return <tr key={player._id}>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={filteredPlayers.includes(player._id)}
                  />
                </td>

                <td className="border p-2">{player.fullName}</td>
                <td className="border p-2">{player.gender}</td>
                <td className="border p-2">{player.event}</td>
                <td className="border p-2">{bd}</td>
              </tr>
            }
            )
          )}
        </tbody>
      </table>

      {/* 🔹 Optional: Selected IDs */}
      <div className="mt-4 text-sm">
        <strong>Selected:</strong> {filteredPlayers.join(", ")}
      </div>
    </div>

    </div>
  )
}

export default TournamentEntry
