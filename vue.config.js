module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/SARS-CoV-2-Analysis/'
        : '/',
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ]
}