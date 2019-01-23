<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="stats in statsCards">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{stats.title}}</p>
            {{stats.value}}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>

    <div class="row">
        <div class="col-lg-8 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Top wins by locations</h4>
              <p class="category"></p>
            </div>
            <div class="card-content">
              <div class="row">
                <div class="col-md-7">
                  <world-map></world-map>
                </div>
                <div class="col-md-5">
                  <div class="table-responsive">
                    <table class="table">
                      <tbody>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="/static/img/flags/US.png">
                          </div>
                        </td>
                        <td>USA</td>
                        <td class="text-right">
                          2.920
                        </td>
                        <td class="text-right">
                          53.23%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="/static/img/flags/DE.png">
                          </div>
                        </td>
                        <td>Germany</td>
                        <td class="text-right">
                          1.300
                        </td>
                        <td class="text-right">
                          20.43%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="/static/img/flags/AU.png">
                          </div>
                        </td>
                        <td>Australia</td>
                        <td class="text-right">
                          760
                        </td>
                        <td class="text-right">
                          10.35%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="/static/img/flags/GB.png">
                          </div>
                        </td>
                        <td>United Kingdom</td>
                        <td class="text-right">
                          690
                        </td>
                        <td class="text-right">
                          7.87%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="/static/img/flags/RO.png">
                          </div>
                        </td>
                        <td>Romania</td>
                        <td class="text-right">
                          600
                        </td>
                        <td class="text-right">
                          5.94%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="/static/img/flags/BR.png">
                          </div>
                        </td>
                        <td>Brasil</td>
                        <td class="text-right">
                          550
                        </td>
                        <td class="text-right">
                          4.34%
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-sm-6">
          <chart-card :chart-data="earningsChart.data" :chart-options="earningsChart.options">
            <span slot="title">$34,657</span>
            <span slot="title-label" class="label label-success">
              +18%
            </span>
            <h6 slot="subtitle">
              total earnings <span class="text-muted">in last</span> ten <span class="text-muted">quarters</span>
            </h6>
            <div slot="footer-title">
              Financial Statistics
            </div>
            <button slot="footer-right" class="btn btn-info btn-fill btn-icon btn-sm">
              <i class="ti-plus"></i>
            </button>
          </chart-card>
        </div>
    </div>

    <div class="row">
      <div class="col-lg-3 col-sm-6">
        <circle-chart-card :percentage="70"
                           title="Dashboard"
                           description="Monthly sales target"
                           color="blue">
        </circle-chart-card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <circle-chart-card :percentage="34"
                           title="Orders"
                           description="Completed"
                           color="green">
        </circle-chart-card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <circle-chart-card :percentage="62"
                           title="New Visitors"
                           description="Out of total number"
                           color="orange">
        </circle-chart-card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <circle-chart-card :percentage="10"
                           title="Subscriptions"
                           description="Monthly newsletter"
                           color="brown">
        </circle-chart-card>
      </div>
    </div>

  </div>
</template>
<script>
  import CircleChartCard from '../../../../components/UIComponents/Cards/CircleChartCard.vue'
  import StatsCard from '../../../../components/UIComponents/Cards/StatsCard.vue'
  import ChartCard from '../../../../components/UIComponents/Cards/ChartCard.vue'
  import Loading from '../../../../components/Dashboard/Layout/LoadingMainPanel.vue'

  const WorldMap = () => ({
    component: import('./../Maps/WorldMap.vue'),
    loading: Loading,
    delay: 200
  })

  export default {
    components: {
      StatsCard,
      ChartCard,
      CircleChartCard,
      WorldMap
    },
    /**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
    data() {
      return {
        statsCards: [
          {
            type: 'success',
            icon: 'ti-wallet',
            title: 'GBP',
            value: '£12.56',
            footerText: 'Top up',
            footerIcon: 'ti-plus'
          },
          {
            type: 'success',
            icon: 'ti-wallet',
            title: 'USD',
            value: '$103.98',
            footerText: 'Top up',
            footerIcon: 'ti-plus'
          },
          {
            type: 'success',
            icon: 'ti-wallet',
            title: 'VoX',
            value: '240 vox',
            footerText: 'Top up',
            footerIcon: 'ti-plus'
          },
          {
            type: 'success',
            icon: 'ti-wallet',
            title: 'Bitcoin',
            value: 'B 0.0048',
            footerText: 'Top up',
            footerIcon: 'ti-plus'
          },
        ],
        earningsChart: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June'],
            series: [
              [230, 340, 400, 300, 570, 500, 800]
            ]
          },
          options: {
            showPoint: false,
            lineSmooth: true,
            height: '210px',
            axisX: {
              showGrid: false,
              showLabel: true
            },
            axisY: {
              offset: 40,
              showGrid: false
            },
            low: 0,
            high: 'auto',
            classNames: {
              line: 'ct-line ct-green'
            }
          }
        }

      }
    }
  }
</script>
<style>

</style>
