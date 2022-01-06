<script>
import Chart from 'chart.js';
import { generateChart, mixins } from 'vue-chartjs';

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
  draw: function(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
         var activePoint = this.chart.tooltip._active[0],
             ctx = this.chart.ctx,
             x = activePoint.tooltipPosition().x,
             topY = this.chart.scales['y-axis-0'].top,
             bottomY = this.chart.scales['y-axis-0'].bottom;

         // draw line
         ctx.save();
         ctx.beginPath();
         ctx.moveTo(x, topY);
         ctx.lineTo(x, bottomY);
         ctx.lineWidth = 2;
         ctx.strokeStyle = 'rgba(128,128,128,0.33)'; // '#aaa';
         ctx.stroke();
         ctx.restore();
      }
  }
})
const CustomLine = generateChart('custom-line', 'LineWithLine')

const { reactiveProp } = mixins;

export default {
  extends: CustomLine,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    // todo: make gradient such that 2 week doubling time is a different color
    // let gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 1)
    // gradient.addColorStop(0, 'rgba(255, 0,0, 0.9)')
    // gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.9)');
    // gradient.addColorStop(1, 'rgba(0, 0, 255, 0.9)');
    // this.chartData.datasets[0].backgroundColor = gradient;
    this.renderChart(this.chartData, this.options);
  },
}
</script>

<style>
</style>