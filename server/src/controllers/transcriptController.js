const Transcript = require(
  "../models/Transcript"
);

exports.addTranscript =
  async (req, res) => {

    try {

      const transcript =
        await Transcript.create({
          interview:
            req.body.interviewId,

          speaker:
            req.body.speaker,

          text:
            req.body.text,
        });

      res.status(201).json({
        success: true,
        transcript,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

exports.getTranscripts =
  async (req, res) => {

    try {

      const transcripts =
        await Transcript.find({
          interview:
            req.params.interviewId,
        }).sort({
          createdAt: 1,
        });

      res.status(200).json({
        success: true,
        transcripts,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };