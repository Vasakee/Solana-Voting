export type Voting = {
  address: "7VpBtEPysH7nWgqwtMH6DDMAWYFZZKpKN9xX2AmJyU1J";
  metadata: { name: "voting"; version: "0.1.0"; spec: "0.1.0" };
  instructions: [
    {
      name: "initPoll";
      discriminator: [220, 174, 117, 29, 132, 91, 29, 46];
      accounts: [
        { name: "signer"; writable: true; signer: true },
        { name: "pollAccount"; writable: true; pda: { seeds: [{ kind: "const"; value: [112, 111, 108, 108] }, { kind: "arg"; path: "pollId" }] } },
        { name: "systemProgram"; address: "11111111111111111111111111111111" }
      ];
      args: [
        { name: "pollId"; type: "u64" },
        { name: "start"; type: "u64" },
        { name: "end"; type: "u64" },
        { name: "name"; type: "string" },
        { name: "description"; type: "string" }
      ];
    },
    {
      name: "initializeCandidate";
      discriminator: [219, 192, 234, 116, 202, 21, 11, 45];
      accounts: [
        { name: "signer"; writable: true; signer: true },
        { name: "pollAccount"; writable: true; pda: { seeds: [{ kind: "const"; value: [112, 111, 108, 108] }, { kind: "arg"; path: "pollId" }] } },
        { name: "candidateAccount"; writable: true; pda: { seeds: [{ kind: "const"; value: [99, 97, 110, 100, 105, 100, 97, 116, 101] }, { kind: "arg"; path: "pollId" }, { kind: "arg"; path: "candidate" }] } },
        { name: "systemProgram"; address: "11111111111111111111111111111111" }
      ];
      args: [
        { name: "pollId"; type: "u64" },
        { name: "candidate"; type: "string" }
      ];
    },
    {
      name: "vote";
      discriminator: [227, 110, 155, 23, 136, 126, 172, 25];
      accounts: [
        { name: "signer"; writable: true; signer: true },
        { name: "pollAccount"; writable: true; pda: { seeds: [{ kind: "const"; value: [112, 111, 108, 108] }, { kind: "arg"; path: "pollId" }] } },
        { name: "candidateAccount"; writable: true; pda: { seeds: [{ kind: "const"; value: [99, 97, 110, 100, 105, 100, 97, 116, 101] }, { kind: "arg"; path: "pollId" }, { kind: "arg"; path: "candidateName" }] } },
        { name: "systemProgram"; address: "11111111111111111111111111111111" }
      ];
      args: [
        { name: "pollId"; type: "u64" },
        { name: "candidateName"; type: "string" }
      ];
    }
  ];
  accounts: [
    {
      name: "PollAccount";
      discriminator: [110, 234, 167, 188, 231, 136, 153, 111];
    },
    {
      name: "CandidateAccount";
      discriminator: [142, 246, 195, 235, 162, 107, 11, 138];
    }
  ];
  types: [
    {
      name: "PollAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "pollName"; type: "string" },
          { name: "pollDescription"; type: "string" },
          { name: "pollVotingStart"; type: "u64" },
          { name: "pollVotingEnd"; type: "u64" },
          { name: "pollOptionIndex"; type: "u64" }
        ];
      };
    },
    {
      name: "CandidateAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "candidateIndex"; type: "u64" },
          { name: "candidateName"; type: "string" },
          { name: "candidateVotes"; type: "u64" }
        ];
      };
    }
  ];
};

export const IDL: Voting = {
  address: "7VpBtEPysH7nWgqwtMH6DDMAWYFZZKpKN9xX2AmJyU1J",
  metadata: { name: "voting", version: "0.1.0", spec: "0.1.0" },
  instructions: [
    {
      name: "initPoll",
      discriminator: [220, 174, 117, 29, 132, 91, 29, 46],
      accounts: [
        { name: "signer", writable: true, signer: true },
        { name: "pollAccount", writable: true, pda: { seeds: [{ kind: "const", value: [112, 111, 108, 108] }, { kind: "arg", path: "pollId" }] } },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "pollId", type: "u64" },
        { name: "start", type: "u64" },
        { name: "end", type: "u64" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
      ],
    },
    {
      name: "initializeCandidate",
      discriminator: [219, 192, 234, 116, 202, 21, 11, 45],
      accounts: [
        { name: "signer", writable: true, signer: true },
        { name: "pollAccount", writable: true, pda: { seeds: [{ kind: "const", value: [112, 111, 108, 108] }, { kind: "arg", path: "pollId" }] } },
        { name: "candidateAccount", writable: true, pda: { seeds: [{ kind: "const", value: [99, 97, 110, 100, 105, 100, 97, 116, 101] }, { kind: "arg", path: "pollId" }, { kind: "arg", path: "candidate" }] } },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "pollId", type: "u64" },
        { name: "candidate", type: "string" },
      ],
    },
    {
      name: "vote",
      discriminator: [227, 110, 155, 23, 136, 126, 172, 25],
      accounts: [
        { name: "signer", writable: true, signer: true },
        { name: "pollAccount", writable: true, pda: { seeds: [{ kind: "const", value: [112, 111, 108, 108] }, { kind: "arg", path: "pollId" }] } },
        { name: "candidateAccount", writable: true, pda: { seeds: [{ kind: "const", value: [99, 97, 110, 100, 105, 100, 97, 116, 101] }, { kind: "arg", path: "pollId" }, { kind: "arg", path: "candidateName" }] } },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "pollId", type: "u64" },
        { name: "candidateName", type: "string" },
      ],
    },
  ],
  accounts: [
    { name: "PollAccount", discriminator: [110, 234, 167, 188, 231, 136, 153, 111] },
    { name: "CandidateAccount", discriminator: [142, 246, 195, 235, 162, 107, 11, 138] },
  ],
  types: [
    {
      name: "PollAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "pollName", type: "string" },
          { name: "pollDescription", type: "string" },
          { name: "pollVotingStart", type: "u64" },
          { name: "pollVotingEnd", type: "u64" },
          { name: "pollOptionIndex", type: "u64" },
        ],
      },
    },
    {
      name: "CandidateAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "candidateIndex", type: "u64" },
          { name: "candidateName", type: "string" },
          { name: "candidateVotes", type: "u64" },
        ],
      },
    },
  ],
};
