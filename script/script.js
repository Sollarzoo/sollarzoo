const mapConfig = { "ambientLightEnable": true, "ambientLightColor": "#FFFFFF", "ambientLightIntensity": 1, "directionalLightEnable": true, "directionalLightColor": "#dadada", "directionalLightIntensity": 1, "directionalLightPosition": [-0.5, 0.7, 0.6], "pointLightEnable": false, "pointLightColor": "#ffffff", "pointLightIntensity": 1, "pointLightHeight": 500, "pointLightOffset": 0.2, "pointLightDecay": 1, "pointLightDistance": 0, "skyColor": { "image": "", "colors": [{ "offset": 0, "color": "rgba(52, 72, 95, 1)" }, { "offset": 0.25, "color": "rgba(52, 72, 95, 1)" }, { "offset": 0.73, "color": "rgba(21, 30, 62, 1)" }, { "offset": 0.79, "color": "rgba(21, 30, 62, 0)" }, { "offset": 1, "color": "rgba(21, 30, 62, 0)" }] }, "backgroundColor": "#273e5e", "postProcessingEnabled": true, "tileBloomConfig": { "enabled": false, "strength": 0.8, "radius": 0.5, "threshold": 0.3 }, "tileVignetteConfig": { "enabled": false, "color": "#ffffff", "offset": 1, "darkness": 0 }, "tileToneMappingConfig": { "enabled": false, "brightness": 0, "contrast": 1, "saturation": 1, "exposure": 0 }, "postProcessingConfig": { "envMap": "", "envMapIntensity": 1, "envMapAngle": 0, "toneMapping": "NoToneMapping", "toneMappingExposure": 1 }, "meta": { "id": "", "version": "2.5" }, "background": { "color": "#273e5e", "materialType": "basic", "metalness": 0, "roughness": 0 } };
export default {
    mounted() {
        this.$map = new FMap3D.Map(this.$refs.el, {
            center: [116.3, 40], //设置地图区域中心
            zoom: 11, //设置地图缩放层级
            pitch: Math.PI / 3,
            bearing: Math.PI / 6,
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
            ...mapConfig,
        });
        this.$vectorTileLayer = new FMap3D.layer.YTTVectorTileLayer({
            style: {
                theme: "https://raw.githubusercontent.com/Sollarzoo/sollarzoo/master/theme/darkNight01-map-style.json", //  地图样式的 URL链接 或者 json文件
            },
        });
        this.$map.addLayer(this.$vectorTileLayer);

        // init point layer
        this.$layer = new FMap3D.layer.Bar({
            style: {
                image: {
                    radius: 150,
                    //type: "circle",
                    //anchor: [0.5, 0.5],
                },
                stroke: {
                    color: "#D9DDE7",
                    opacity: 0,
                    width: 0,
                },
                fill: {
                    color: "#D9DDE7",
                    opacity: 1,
                },
            },
        });
        this.$map.addLayer(this.$layer);

        // 定义映射函数
        function mapRange(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        }


        // 初始化数据
        fetch("https://raw.githubusercontent.com/Sollarzoo/sollarzoo/master/data/Airbnb_prices_Beijing.json")
            .then((res) => res.json())
            .then((res) => {
                const minPrice = Math.min(...res.data.map(item => item.price));
                const maxPrice = Math.max(...res.data.map(item => item.price));
                const step = 100;
                const colors = ["#00939C", "#2FA7AE", "#5DBABF", "#8CCED1", "#BAE1E2", "#F8C0AA", "#EB9C80", "#DD7755", "#D0532B", "#C22E00"];

                // 定义映射函数
                function mapRange(value, low1, high1, low2, high2) {
                    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
                }
                const maxStep = step * colors.length;


                function mapValueToColor(value) {
                    if (value > maxStep) {
                        return colors[colors.length - 1];
                    }
                    const index = Math.floor(mapRange(value, minPrice, maxStep, 0, colors.length * step));
                    const colorIndex = Math.floor(index / step);
                    return colors[colorIndex];
                }

                this.$featureCollection = FMap3D.transform.pointsCollection(res.data);
                this.$featureCollection.features.forEach(item => {
                    //const initialRadius = mapRange(item.properties.price, minPrice, maxPrice, 100, 10000);
                    const color = mapValueToColor(item.properties.price);
                    // item.properties.value =  initialRadius;
                    item.properties.style = {};
                    item.properties.style.image = {
                        vertex: 4,
                    };
                    //  item.properties.style.stroke = {
                    //   color: color,
                    //   opacity: 1,
                    //   width: 0.5,
                    // };
                    item.properties.style.fill = {
                        height: item.properties.price / 10,
                        color: color,
                        opacity: 0.9,
                    };

                    // item.properties.originalRadius = initialRadius;
                });

                this.$layer.setData(this.$featureCollection);
            });


    },
    beforeDestroy() {
        this.$map.destroy();
        this.$map = null;
    },
};