export default {
    mounted() {
        this.$map = new FMap3D.Map(this.$refs.el, {
            center: [116.3, 40.1], //设置地图区域中心
            zoom: 8, //设置地图缩放层级
            ambientLightColor: "#C7E6FE",
            ambientLightIntensity: "1",
            directionalLightColor: "#EAF4FB",
            directionalLightIntensity: "1",
            backgroundColor: "#1E2F70",
            skyColor: {
                color0: "#193977",
                color1: "#234784",
                opacity0: "1",
                opacity1: "1",
            },
        });
        this.$vectorTileLayer = new FMap3D.layer.YTTVectorTileLayer();
        this.$map.addLayer(this.$vectorTileLayer);

        // init point layer
        this.$layer = new FMap3D.layer.Point({
            style: {
                theme: "https://raw.githubusercontent.com/Sollarzoo/sollarzoo/master/theme/darkNight01-map-style.json", //  地图样式的 URL链接 或者 json文件
            },
        });

        this.$map.addLayer(this.$layer);

        // 初始化数据
        fetch("https://raw.githubusercontent.com/Sollarzoo/sollarzoo/master/data/Airbnb_prices_Beijing.json")
            .then((res) => res.json())
            .then((res) => {
                this.$featureCollection = FMap3D.transform.pointsCollection(res.data);
                this.$featureCollection.features.forEach(item => {
                    item.properties.style = {}
                    item.properties.style.image = {
                        radius: item.properties.price / 3000 + 1,
                        type: "circle",
                    }
                })
                this.$layer.setData(this.$featureCollection);
            });
    },
    beforeDestroy() {
        this.$map.destroy();
        this.$map = null;
    },
};