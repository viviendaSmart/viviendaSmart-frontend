export class Config{
  id?: number;
  private rate!: number;
  private rateType!: string;
  private exchange!: string;
  private termtype!: string;
  private term!: string;
  private userId!: number;

  constructor(config:{
    id?: number;
    rate: number;
    rateType: string;
    exchange: string;
    termtype: string;
    term: string;
    userId: number;
  }
  ) {
    this.id = config.id;
    this.rate = config.rate;
    this.rateType = config.rateType;
    this.exchange = config.exchange;
    this.termtype = config.termtype;
    this.term = config.term;
    this.userId = config.userId;
  }
}
