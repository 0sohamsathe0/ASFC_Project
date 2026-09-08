import { getFeeAccountView } from "../services/fee-account-service.js";
import { FeeServiceError } from "../services/fee-errors.js";

const getOwnFeeAccount = async (req, res) => {
  try {
    const data = await getFeeAccountView({
      playerId: req.user.id,
      financialYearStart: req.query.financialYearStart,
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof FeeServiceError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    }
    console.error("Get Own Fee Account Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the fee account.",
    });
  }
};

export { getOwnFeeAccount };
