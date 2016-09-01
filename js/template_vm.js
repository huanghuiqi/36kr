/**
 * [template 功能：返回json数据给模板]
 * @param  {[string]} url [json数据源]
 * @param  {[string]} templateId [html模板的ID]
 * @param  {[dom元素]} targetOperator [触发加载的元素]
 * @param  {[dom元素]} changeObj [改变计数的元素]
 * @return {[dom元素]} appendObj [数据追加到的目标]
 */
function template_vm(url, templateIdName, targetOperator, changeObj, appendObj,eachLength) {
    function getData(callback) {
        $.ajax({
            url: url,
            success: function (data) {
                callback(data);
            }
        });
    }

    //定义一个全局存放获取的json数据
    var arrayData = [];
    //初始化
    getData(function (data) {
        arrayData = data;
        var array = dataHandle(arrayData);
        /*
         * array返回的是截取其中一段的数组
         * */
        templateCreate(array);
    });
    //鼠标点击
    $(targetOperator).on("click", function () {
        var array = dataHandle(arrayData);
        templateCreate(array);
    });

    //数据取出函数
    function dataHandle(arrayData) {
        //1、定义每次获取5条条数据
        //var eachLength = 5;
        //2、获取定义在content上的页码记录属性，初始值为1
        var dataNum = +$(changeObj).attr("dataNum");
        //3、获取json的数据长度
        var totlaLength = arrayData.length;
        //4、取得最大页码数
        var maxPage = Math.ceil(totlaLength / eachLength);
        //5、起始值
        var startIndex = dataNum * eachLength;
        //6、从1开始 取出3条
        var array = arrayData.slice(startIndex, eachLength * (dataNum + 1));
        //7、更新页码
        dataNum = dataNum + 1;
        $(changeObj).attr("dataNum", dataNum);
        //8、判断
        if (dataNum == maxPage) {
            $(targetOperator).html('已加载完毕');
        }
        return array;
    }

    //模板生成函数
    function templateCreate(array) {
        //生成模板
        var templateId = _.template($(templateIdName).html());
        var templateContent = templateId({arr: array});
        $(appendObj).append(templateContent);
    }
}

$(function () {
    //ajax获取后台数据
    function getBannerData(callback) {
        $.ajax({
            url: "json/banner.json",
            success: function (data) {
                callback(data);
            }
        })
    }

    function getRecommendData(callback) {
        $.ajax({
            url: "json/recommend.json",
            success: function (data) {
                callback(data);
            }
        })
    }

    function getBestComment(callback) {
        $.ajax({
            url: "json/bestComment.json",
            success: function (data) {
                callback(data);
            }
        })
    }

    function getBestCompany(callback) {
        $.ajax({
            url: "json/bestCompany.json",
            success: function (data) {
                callback(data);
            }
        })
    }

    getBannerData(function (data) {
        var templateBanne = _.template($("#template_banner").html());
        var templateIndicator = _.template($("#template_indicator").html());

        var content = templateBanne({arr: data});
        var content_indi = templateIndicator({arr: data});

        $(".carousel-inner").html(content);
        $(".carousel-indicators").html(content_indi);

    });

    getRecommendData(function (data) {
        var templateRecommend = _.template($("#template_recommend").html());

        var content = templateRecommend({arr: data});

        $("#recommend_model").html(content);
    });

    getBestComment(function (data) {
        var templateBestComment = _.template($("#template_bestComment").html());

        var content = templateBestComment({arr: data});

        $("#bestComment_tmp").html(content);
    });

    getBestCompany(function (data) {
        var templateBestCompany = _.template($("#template_bestCompany").html());

        var content = templateBestCompany({arr: data});

        $("#bestCompany_tmp").html(content);
    });

    template_vm("json/newlist.json",
        "#template_newsList",
        $("#news-list_vm"),
        $(".news-list"),
        $(".news-list ul"),5
    );

    template_vm("json/newsFlash.json",
        "#template_newsFlash",
        $("#news_flash_vm"),
        $(".news_flash"),
        $(".news_flash ul"),10
    );

});