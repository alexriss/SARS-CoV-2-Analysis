<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'options', 'update'],
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
      this.renderChart(this.chartData, this.options);
    }
  }
}
</script>

<style>
</style>