/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { ROLES } from './game-assemblages';

/*
  Needed some hacky stuff here to make the types work together overall.
  The Entity.addComponent requires the input argument to be of any component
  type (union of classes), but when we are accessing individual attributes of the
  components, we need its individual elements.
*/
export interface IAllComponents
  extends ComponentPlayer,
    ComponentAlliance,
    ComponentRole,
    ComponentRole,
    ComponentVoteTeam,
    ComponentVoteMission,
    ComponentSeeAlliance {}

export type AllComponents =
  | ComponentPlayer
  | ComponentAlliance
  | ComponentRole
  | ComponentVoteTeam
  | ComponentVoteMission
  | ComponentSeeAlliance;

export class Component {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// socketId is initially undefined. Game should set this after instantiation.
export class ComponentPlayer extends Component {
  socketId: string | undefined;

  constructor() {
    super('player');
    this.socketId = undefined;
  }
}

type Alliance = 'resistance' | 'spy';
export class ComponentAlliance extends Component {
  alliance: string;

  constructor(alliance: Alliance) {
    super('alliance');
    this.alliance = alliance;
  }
}

export class ComponentRole extends Component {
  role: string;

  constructor(role: ROLES) {
    super('role');
    this.role = role;
  }
}

export type VoteTeam = 'approve' | 'reject' | undefined;
export class ComponentVoteTeam extends Component {
  voteTeam: VoteTeam;

  constructor() {
    super('voteTeam');
    this.voteTeam = undefined;
  }
}

export type VoteMission = 'succeed' | 'fail' | undefined;
export class ComponentVoteMission extends Component {
  voteMission: VoteMission;

  constructor() {
    super('voteMission');
    this.voteMission = undefined;
  }
}

export class ComponentSeeAlliance extends Component {
  visibleRoles: ROLES[];

  constructor(visibleRoles: ROLES[] | 'all') {
    super('seeAlliance');

    // Default see ALL roles.
    // TODO Update this for Oberon later.
    if (visibleRoles === 'all') {
      this.visibleRoles = Object.keys(ROLES) as ROLES[];
    } else {
      this.visibleRoles = visibleRoles;
    }
  }
}
