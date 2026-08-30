const Interview = require("../models/Interview");

exports.getAnalytics = async (req, res) => {
  try {
    // ALL USER INTERVIEWS
    const interviews = await Interview.find({
      user: req.user.id,
    });

      // TOTALS

      const totalInterviews =
        interviews.length;

      const averageScore =
        interviews.length
          ? (
              interviews.reduce(
                (
                  acc,
                  curr
                ) =>
                  acc +
                  (curr.score ||
                    0),
                0
              ) /
              interviews.length
            ).toFixed(1)
          : 0;

      const bestScore =
        interviews.length
          ? Math.max(
              ...interviews.map(
                (i) =>
                  i.score || 0
              )
            )
          : 0;

      // MOST PRACTICED MODE

      const modeCounts = {};

      interviews.forEach(
        (interview) => {

          modeCounts[
            interview.mode
          ] =
            (modeCounts[
              interview.mode
            ] || 0) + 1;
        }
      );

      const mostPracticedMode =
        Object.keys(
          modeCounts
        ).reduce(
          (a, b) =>
            modeCounts[a] >
            modeCounts[b]
              ? a
              : b,
          "Technical"
        );

      // RECENT SCORES

      const recentScores =
        interviews
          .sort(
            (a, b) =>
              new Date(
                a.createdAt
              ) -
              new Date(
                b.createdAt
              )
          )
          .map(
            (
              interview
            ) => ({
              date:
                new Date(
                  interview.createdAt
                ).toLocaleDateString(),

              score:
                interview.score ||
                0,
            })
          );

      // TOPIC ANALYTICS

      const modes = [
        "Technical",
        "HR",
        "Behavioral",
        "System Design",
        "DSA",
      ];

      const topicAnalytics =
        modes.map((mode) => {

          const filtered =
            interviews.filter(
              (
                interview
              ) =>
                interview.mode ===
                mode
            );

          const avg =
            filtered.length
              ? (
                  filtered.reduce(
                    (
                      acc,
                      curr
                    ) =>
                      acc +
                      (curr.score ||
                        0),
                    0
                  ) /
                  filtered.length
                ).toFixed(1)
              : 0;

          return {
            mode,
            score:
              Number(avg),
          };
        });

      // PERFORMANCE GROWTH

      let improvement = 0;

      if (
        interviews.length >= 2
      ) {

        const sorted =
          [...interviews].sort(
            (a, b) =>
              new Date(
                a.createdAt
              ) -
              new Date(
                b.createdAt
              )
          );

        const first =
          sorted[0].score || 0;

        const last =
          sorted[
            sorted.length - 1
          ].score || 0;

        improvement =
          (
            last - first
          ).toFixed(1);
      }

      // RADAR CHART

      const radarData = [
        {
          skill:
            "Communication",

          score:
            Number(
              (
                averageScore *
                0.9
              ).toFixed(1)
            ),
        },

        {
          skill:
            "Problem Solving",

          score:
            Number(
              (
                averageScore *
                1.1
              ).toFixed(1)
            ),
        },

        {
          skill:
            "Technical Depth",

          score:
            Number(
              (
                averageScore *
                1.05
              ).toFixed(1)
            ),
        },

        {
          skill:
            "Confidence",

          score:
            Number(
              (
                averageScore *
                0.95
              ).toFixed(1)
            ),
        },

        {
          skill:
            "System Design",

          score:
            Number(
              (
                averageScore *
                0.85
              ).toFixed(1)
            ),
        },

        {
          skill: "DSA",

          score:
            Number(
              (
                averageScore *
                0.8
              ).toFixed(1)
            ),
        },
      ];

      res.status(200).json({
        success: true,

        analytics: {
          totalInterviews,
          averageScore,
          bestScore,
          mostPracticedMode,
          recentScores,
          topicAnalytics,
          improvement,
          radarData,
        },
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