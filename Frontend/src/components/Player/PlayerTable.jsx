const PlayerTable = ({ title, data = [], onEdit }) => {
  const getStyles = () => {
    switch (title) {
      case "Accepted":
        return {
          border: "border-l-4 border-green-500",
          text: "text-green-400",
        };
      case "Pending":
        return {
          border: "border-l-4 border-yellow-400",
          text: "text-yellow-300",
        };
      case "Rejected":
        return {
          border: "border-l-4 border-red-500",
          text: "text-red-400",
        };
      default:
        return {};
    }
  };

  const styles = getStyles();

  return (
    <div className={`bg-slate-800 p-4 rounded-xl ${styles.border}`}>
      <h2 className={`text-lg font-semibold mb-4 ${styles.text}`}>
        {title} ({data.length})
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400">No players</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-600 text-gray-300">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((player) => (
              <tr
                key={player._id}
                className="border-b border-gray-700 hover:bg-slate-700 transition"
              >
                <td className="p-2">{player.fullName}</td>
                <td className="p-2">{player.email}</td>
                <td className="p-2">{player.gender}</td>

                <td className="p-2">
                  <button
                    onClick={() => onEdit(player)}
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
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

export default PlayerTable;