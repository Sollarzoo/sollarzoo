const mapConfig = { "ambientLightEnable": true, "ambientLightColor": "#FFFFFF", "ambientLightIntensity": 1, "directionalLightEnable": true, "directionalLightColor": "#dadada", "directionalLightIntensity": 1, "directionalLightPosition": [-0.5, 0.7, 0.6], "pointLightEnable": false, "pointLightColor": "#ffffff", "pointLightIntensity": 1, "pointLightHeight": 500, "pointLightOffset": 0.2, "pointLightDecay": 1, "pointLightDistance": 0, "skyColor": { "image": "", "colors": [{ "offset": 0, "color": "rgba(52, 72, 95, 1)" }, { "offset": 0.25, "color": "rgba(52, 72, 95, 1)" }, { "offset": 0.73, "color": "rgba(21, 30, 62, 1)" }, { "offset": 0.79, "color": "rgba(21, 30, 62, 0)" }, { "offset": 1, "color": "rgba(21, 30, 62, 0)" }] }, "backgroundColor": "#080808", "postProcessingEnabled": true, "tileBloomConfig": { "enabled": false, "strength": 0.8, "radius": 0.5, "threshold": 0.3 }, "tileVignetteConfig": { "enabled": false, "color": "#ffffff", "offset": 1, "darkness": 0 }, "tileToneMappingConfig": { "enabled": false, "brightness": 0, "contrast": 1, "saturation": 1, "exposure": 0 }, "postProcessingConfig": { "envMap": "", "envMapIntensity": 1, "envMapAngle": 0, "toneMapping": "NoToneMapping", "toneMappingExposure": 1 }, "meta": { "id": "6433bfe7ac627b090088a075", "version": "2.5" }, "background": { "color": "#080808", "materialType": "basic", "metalness": 0, "roughness": 0 } }
let layerStyle = {
    layer: {
        opacity: 1,
        radius: 20,
        gradient: {
            colors: [
                "#130C37",
                "#4F1A6A",
                "#A23C5A",
                "#E17D37",
                "#F0BD48",
                "#FCFDAD",
            ],
            positions: [0, 0.1, 0.2, 0.3, 0.5, 1.0],
        },
        height: 40, // 拉伸的高度
    },
};

export default {
    mounted() {
        this.$map = new FMap3D.Map(this.$refs.container, {
            center: [105, 33], //设置地图区域中心
            zoom: 0, //设置地图缩放层级
            pitch: 0,
            ambientLightColor: "#202048",
            ambientLightIntensity: "1",
            directionalLightColor: "#F2F5FB",
            directionalLightIntensity: "1",
            skyColor: {
                color0: "#252532",
                color1: "#383844",
                opacity0: "1",
                opacity1: "1",
            },
            ...mapConfig,
        });
        this.$vectorTileLayer = new FMap3D.layer.YTTVectorTileLayer({
            style: {
                theme: "https://raw.githubusercontent.com/Sollarzoo/sollarzoo/master/theme/darkNight02-map-style.json", //  地图样式的 URL链接 或者 json文件
            },
        });
        this.$map.addLayer(this.$vectorTileLayer);

        // init heatmap layer
        this.$layer = new FMap3D.layer.Heatmap({
            layer: layerStyle.layer,
        });
        this.$map.addLayer(this.$layer);

        // 初始化数据
        fetch("https://raw.githubusercontent.com/Sollarzoo/sollarzoo/master/data/new_earthquake.json")
            .then((res) => res.json())
            .then((res) => {
                this.$featureCollection = FMap3D.transform.pointsCollection(res.data);
                this.$layer.setData(this.$featureCollection);
            });
    },
    beforeDestroy() {
        this.$map.destroy();
        this.$map = null;
    },
};