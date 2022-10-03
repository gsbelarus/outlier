interface INode {
  time: number;
  v: number;
};

export interface IOutlierResult {
  zScoreOutlier: boolean;
  rangeOutlier: boolean;
};

export class Consumer {
  data: INode[] = [];
  median: number = 0;
  q1: number = 0;
  q3: number = 0;
  iqr: number = 0;
  mean: number = 0;
  sd: number = 0;

  private findIndex(l: number, h: number, v: number): number {
    const step = Math.floor((h - l) / 2);

    if (!step) {
      if (v <= this.data[l].v) {
        return l;
      }
      else if (v > this.data[h].v) {
        return h + 1;
      }
      else {
        return l + 1;
      }
    }

    const mid = step + l;

    if (v < this.data[mid].v) {
      return this.findIndex(l, mid, v);
    }
    else if (v > this.data[mid].v) {
      return this.findIndex(mid, h, v);
    }
    else {
      return mid;
    }
  }

  accept(v: number): IOutlierResult {
    const newItem = { 
      time: new Date().getTime(), 
      v,
    };

    const now = new Date().getTime();
    this.data = this.data.filter( i => (now - i.time) <= 5 * 60 * 1000 );

    if (this.data.length) {
      const idx = this.findIndex(0, this.data.length - 1, v);
      this.data = this.data.slice(0, idx)
        .concat(newItem)
        .concat(this.data.slice(idx));
    } else {
      this.data = [newItem]
    }

    const medianIdx = Math.floor(this.data.length / 2);
    const q1Idx = Math.floor(medianIdx / 2);
    const q3Idx = Math.floor(medianIdx / 2) + medianIdx;

    this.median = this.data[medianIdx].v;
    this.q1 = this.data[q1Idx].v;
    this.q3 = this.data[q3Idx].v;
    this.iqr = this.q3 - this.q1;
    this.mean = Math.round(this.data.reduce( (p, { v }) => p + v, 0 ) / this.data.length * 1000) / 1000;
    if (this.data.length > 1) {
      this.sd = Math.round(Math.sqrt(this.data.reduce( (p, { v }) => p + (v - this.mean) ** 2, 0 ) / (this.data.length - 1)) * 1000) / 1000;
    } else {
      this.sd = Math.round(Math.sqrt(this.data.reduce( (p, { v }) => p + (v - this.mean) ** 2, 0 ) / this.data.length) * 1000) / 1000;
    }

    const zScoreOutlier = (Math.abs(v - this.mean) / this.sd) > 2;

    const upperFence = this.q3 + (1.5 * this.iqr);
    const lowerFence = this.q1 - (1.5 * this.iqr);

    const rangeOutlier = this.data.length < 10 
      ? false 
      : (v < lowerFence || v > upperFence);     

    return {
      rangeOutlier,
      zScoreOutlier
    };
  }

  clear() {
    this.data = [];
    this.median = 0;
    this.q1 = 0;
    this.q3 = 0;
    this.iqr = 0;
    this.mean = 0;
    this.sd = 0;
  }
}