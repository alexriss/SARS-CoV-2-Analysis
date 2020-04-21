<script>
import numeral from 'numeral'
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'options', 'update', 'increaseType'],
  mounted () {
    // todo: make gradient such that 2 week doubling time is a different color
    // let gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 1)
    // gradient.addColorStop(0, 'rgba(255, 0,0, 0.9)')
    // gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.9)');
    // gradient.addColorStop(1, 'rgba(0, 0, 255, 0.9)');
    // this.chartData.datasets[0].backgroundColor = gradient;
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    update: function() {
      if (this.increaseType == 'repronum') {
        this.options.scales.yAxes[0].ticks = {min: 0, max: 4};
        this.options.tooltips.callbacks['label'] = function(tooltipItem) {
              return numeral(tooltipItem.yLabel).format('0.00');
          }
      } else {
        this.options.scales.yAxes[0].ticks = {min: 0, max: 0.25};
        this.options.tooltips.callbacks['label'] = function(tooltipItem) {
              let doublingStr = '';
              if (tooltipItem.yLabel <= 0) {
                doublingStr = '∞ d';
              }
              else {
                let doubling = 1/(Math.log(1 + tooltipItem.yLabel)/Math.log(2));
                if (doubling > 366) {
                  doublingStr = '>1y';
                }
                else {
                  doublingStr = numeral(doubling).format('0.0') + 'd';
                }
              }
              return numeral(tooltipItem.yLabel).format('0.0%') + ' / ' + doublingStr;
          }
      }
      this.renderChart(this.chartData, this.options);
    }
  }
}
</script>

<style>
</style>