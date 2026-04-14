const TournamentTable = ({ title, data = [], onEdit }) => {
  const getStyles = () => {
    switch (title) {
      case "Upcoming":
        return "border-l-4 border-green-500 text-green-400";
      case "Ongoing":
        return "border-l-4 border-yellow-400 text-yellow-300";
      case "Completed":
        return "border-l-4 border-gray-500 text-gray-300";
      default:
        return "";
    }
  };

  return (
    <div className={`bg-slate-800 p-4 rounded-xl ${getStyles()}`}>
      <h2 className="text-lg font-semibold mb-4">
        {title} ({data.length})
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400">No tournaments</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600 text-gray-300">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Start Date</th>
              <th className="p-2 text-left">End Date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((tournament) => (
              <tr
                key={tournament._id}
                className="border-b border-gray-700 hover:bg-slate-700"
              >
                <td className="p-2">{tournament.title}</td>
                <td className="p-2">{tournament.locationState}</td>
                <td className="p-2">
                  {new Date(tournament.startingDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {new Date(tournament.endDate).toLocaleDateString()}
                </td>

                <td className="p-2">
                  <button
                    onClick={() => onEdit(tournament)}
                    className="bg-blue-500 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TournamentTable;