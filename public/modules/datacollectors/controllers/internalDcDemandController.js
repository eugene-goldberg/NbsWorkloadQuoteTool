'use strict';

angular.module('datacollectors').controller('InternalDcDemandController',
    ['$scope', '$http', '$stateParams', '$location',
        'Authentication', 'Datacollectors',
        'FileUploader','$rootScope','$window','$sce',
        function($scope, $http, $stateParams, $location, Authentication,
                 Datacollectors, FileUploader,$rootScope,$window,$sce) {

            $scope.dcNames = [];

            $scope.internalDcDemands = [];

            $scope.selectedDcName;

            $scope.selectedInternalDcDemand;

            function initDcList(){
                $http.get('/dc_inventory').success(function(response) {
                    console.log('found ' + response.length + ' records for DcInventory');
                    response.forEach(function(record){
                        $scope.dcNames.push({name: record.DataCenterName, country: record.DcCountry, siteCode: record.DcSiteCode,address: record.DcAddress, region: record.DcRegion});
                    });
                });
            }

            function initInternalDcDemandList(){
                $http.get('/internal_dc_demand_data/').success(function(response) {
                    console.log('found ' + response.length + ' records for internal DC demands');
                    response.forEach(function(record){
                        $scope.internalDcDemands.push({name: record.RequestTitle});
                    });
                });
            }

            function resetForm(){
                $scope.internalDcDemands.forEach(function(demand){
                    demand.ticked = false;
                });
                $scope.requestTitle = '';
                $scope.requestDescription = '';
                $scope.requestorName = '';
                $scope.selectedDc = '';

                $scope.dcCountry = '';
                $scope.dcSiteCode = '';

                $scope.kwRequired_2016 = '';
                $scope.kwRequired_2017 = '';
                $scope.kwRequired_2018 = '';
                $scope.kwRequired_2019 = '';
                $scope.kwRequired_2020 = '';
                $scope.kwRequired_2021 = '';
                $scope.kwRequired_2022 = '';
                $scope.kwRequired_2023 = '';
                $scope.kwRequired_2024 = '';
                $scope.kwRequired_2025 = '';

                $scope.kwRequired_2016_nq = '';
                $scope.kwRequired_2017_nq = '';
                $scope.kwRequired_2018_nq = '';
                $scope.kwRequired_2019_nq = '';
                $scope.kwRequired_2020_nq = '';
                $scope.kwRequired_2021_nq = '';
                $scope.kwRequired_2022_nq = '';
                $scope.kwRequired_2023_nq = '';
                $scope.kwRequired_2024_nq = '';
                $scope.kwRequired_2025_nq = '';

                $scope.cbRequired_2016 = '';
                $scope.cbRequired_2017 = '';
                $scope.cbRequired_2018 = '';
                $scope.cbRequired_2019 = '';
                $scope.cbRequired_2020 = '';
                $scope.cbRequired_2021 = '';
                $scope.cbRequired_2022 = '';
                $scope.cbRequired_2023 = '';
                $scope.cbRequired_2024 = '';
                $scope.cbRequired_2025 = '';

                $scope.cbRequired_2016_nq = '';
                $scope.cbRequired_2017_nq = '';
                $scope.cbRequired_2018_nq = '';
                $scope.cbRequired_2019_nq = '';
                $scope.cbRequired_2020_nq = '';
                $scope.cbRequired_2021_nq = '';
                $scope.cbRequired_2022_nq = '';
                $scope.cbRequired_2023_nq = '';
                $scope.cbRequired_2024_nq = '';
                $scope.cbRequired_2025_nq = '';

                $scope.computeCheckboxModel.cloudCompute = false;
                $scope.computeCheckboxModel.bizCloudHc = false;
                $scope.computeCheckboxModel.bizCloud = false;
                $scope.computeCheckboxModel.storageAsAService = false;
                $scope.computeCheckboxModel.mainframe = false;
                $scope.computeCheckboxModel.unixFarm = false;
                $scope.computeCheckboxModel.windowsFarm = false;
                $scope.computeCheckboxModel.as400 = false;
                $scope.computeCheckboxModel.myWorkstyle = false;
                $scope.computeCheckboxModel.cyber = false;
                $scope.computeCheckboxModel.serviceManagement = false;
                $scope.computeCheckboxModel.lan = false;
                $scope.computeCheckboxModel.wan = false;
                $scope.computeCheckboxModel.isProvidingDr = false;

                    $scope.computeCheckboxModel.assetAndConfigurationManagement = false;
                    $scope.computeCheckboxModel.enterpriseServiceDesk = false;
                    $scope.computeCheckboxModel.firewall = false;
                    $scope.computeCheckboxModel.clientSiteLocalSupport = false;
                    $scope.computeCheckboxModel.loadBalancers = false;
                    $scope.computeCheckboxModel.operationalServiceManagement = false;
                    $scope.computeCheckboxModel.proxy = false;
                    $scope.computeCheckboxModel.remoteManagementServices = false;
                    $scope.computeCheckboxModel.dns = false;
                    $scope.computeCheckboxModel.serviceIntegrationAndManagement = false;
                    $scope.computeCheckboxModel.dataCenterBasedTouchLabor = false;
                    $scope.computeCheckboxModel.serviceRequestManagement = false;
                    $scope.computeCheckboxModel.agilityPlatform = false;
                    $scope.computeCheckboxModel.bigDataAndAnalytics = false;
                    $scope.computeCheckboxModel.mobilityAndSocial = false;

                $scope.drProvidedFor = '';
            }

            $scope.$watch(function(scope) {return  $scope.selectedDcName },
                function(newValue, oldValue) {
                    if(newValue){
                        if(newValue[0]){
                            $scope.$parent.selectedName = newValue[0].name;
                            $scope.selectedDc = newValue[0].name;
                            var matchingDcRecord = $scope.dcNames.filter(function (entry) { return entry.name === newValue[0].name; });
                            $scope.dcCountry = matchingDcRecord[0].country;
                            $scope.dcSiteCode = matchingDcRecord[0].siteCode;
                        }
                    }
                }
            );

            $scope.$watch(function(scope) {return  $scope.selectedInternalDcDemand },
                function(newValue, oldValue) {
                    if(newValue){
                        if(newValue[0]){
                            $scope.$parent.selectedName = newValue[0].name;
                            $http.get('/internal_dc_demand_detail/?requestTitle=' + newValue[0].name).success(function(response) {
                                $scope.requestTitle = response[0].RequestTitle;
                                $scope.requestDescription = response[0].RequestDescription;
                                $scope.requestorName = response[0].RequestorName;

                                $scope.selectedDc = response[0].DataCenterName;
                                //$scope.selectedDcName.push(response);
                                //$scope.selectedDcName[0].name = response[0].DataCenterName;
                                $scope.dcCountry = response[0].DCCountry;
                                $scope.dcSiteCode = response[0].DCSiteCode;

                                $scope.kwRequired_2016 = response[0].kwFY16;
                                $scope.kwRequired_2017 = response[0].kwFY17;
                                $scope.kwRequired_2018 = response[0].kwFY18;
                                $scope.kwRequired_2019 = response[0].kwFY19;
                                $scope.kwRequired_2020 = response[0].kwFY20;
                                $scope.kwRequired_2021 = response[0].kwFY21;
                                $scope.kwRequired_2022 = response[0].kwFY22;
                                $scope.kwRequired_2023 = response[0].kwFY23;
                                $scope.kwRequired_2024 = response[0].kwFY24;
                                $scope.kwRequired_2025 = response[0].kwFY25;

                                $scope.kwRequired_2016_nq = response[0].kwFY16_nq;
                                $scope.kwRequired_2017_nq = response[0].kwFY17_nq;
                                $scope.kwRequired_2018_nq = response[0].kwFY18_nq;
                                $scope.kwRequired_2019_nq = response[0].kwFY19_nq;
                                $scope.kwRequired_2020_nq = response[0].kwFY20_nq;
                                $scope.kwRequired_2021_nq = response[0].kwFY21_nq;
                                $scope.kwRequired_2022_nq = response[0].kwFY22_nq;
                                $scope.kwRequired_2023_nq = response[0].kwFY23_nq;
                                $scope.kwRequired_2024_nq = response[0].kwFY24_nq;
                                $scope.kwRequired_2025_nq = response[0].kwFY25_nq;

                                $scope.cbRequired_2016 = response[0].cbFY16;
                                $scope.cbRequired_2017 = response[0].cbFY17;
                                $scope.cbRequired_2018 = response[0].cbFY18;
                                $scope.cbRequired_2019 = response[0].cbFY19;
                                $scope.cbRequired_2020 = response[0].cbFY20;
                                $scope.cbRequired_2021 = response[0].cbFY21;
                                $scope.cbRequired_2022 = response[0].cbFY22;
                                $scope.cbRequired_2023 = response[0].cbFY23;
                                $scope.cbRequired_2024 = response[0].cbFY24;
                                $scope.cbRequired_2025 = response[0].cbFY25;

                                $scope.cbRequired_2016_nq = response[0].cbFY16_nq;
                                $scope.cbRequired_2017_nq = response[0].cbFY17_nq;
                                $scope.cbRequired_2018_nq = response[0].cbFY18_nq;
                                $scope.cbRequired_2019_nq = response[0].cbFY19_nq;
                                $scope.cbRequired_2020_nq = response[0].cbFY20_nq;
                                $scope.cbRequired_2021_nq = response[0].cbFY21_nq;
                                $scope.cbRequired_2022_nq = response[0].cbFY22_nq;
                                $scope.cbRequired_2023_nq = response[0].cbFY23_nq;
                                $scope.cbRequired_2024_nq = response[0].cbFY24_nq;
                                $scope.cbRequired_2025_nq = response[0].cbFY25_nq;

                                $scope.computeCheckboxModel.cloudCompute = response[0].cloudCompute;
                                $scope.computeCheckboxModel.bizCloudHc = response[0].bizCloudHc;
                                $scope.computeCheckboxModel.bizCloud = response[0].bizCloud;
                                $scope.computeCheckboxModel.storageAsAService = response[0].storageAsAService;
                                $scope.computeCheckboxModel.mainframe = response[0].mainframe;
                                $scope.computeCheckboxModel.unixFarm = response[0].unixFarm;
                                $scope.computeCheckboxModel.windowsFarm = response[0].windowsFarm;
                                $scope.computeCheckboxModel.as400 = response[0].as400;
                                $scope.computeCheckboxModel.myWorkstyle = response[0].myWorkstyle;
                                $scope.computeCheckboxModel.cyber = response[0].cyber;
                                $scope.computeCheckboxModel.serviceManagement = response[0].serviceManagement;
                                $scope.computeCheckboxModel.lan = response[0].lan;
                                $scope.computeCheckboxModel.wan = response[0].wan;

                                    $scope.computeCheckboxModel.assetAndConfigurationManagement = response[0].assetAndConfigurationManagement;
                                    $scope.computeCheckboxModel.enterpriseServiceDesk = response[0].enterpriseServiceDesk;
                                    $scope.computeCheckboxModel.firewall = response[0].firewall;
                                    $scope.computeCheckboxModel.clientSiteLocalSupport = response[0].clientSiteLocalSupport;
                                    $scope.computeCheckboxModel.loadBalancers = response[0].loadBalancers;
                                    $scope.computeCheckboxModel.operationalServiceManagement = response[0].operationalServiceManagement;
                                    $scope.computeCheckboxModel.proxy = response[0].proxy;
                                    $scope.computeCheckboxModel.remoteManagementServices = response[0].remoteManagementServices;
                                    $scope.computeCheckboxModel.dns = response[0].dns;
                                    $scope.computeCheckboxModel.serviceIntegrationAndManagement = response[0].serviceIntegrationAndManagement;
                                    $scope.computeCheckboxModel.dataCenterBasedTouchLabor = response[0].dataCenterBasedTouchLabor;
                                    $scope.computeCheckboxModel.serviceRequestManagement = response[0].serviceRequestManagement;
                                    $scope.computeCheckboxModel.agilityPlatform = response[0].agilityPlatform;
                                    $scope.computeCheckboxModel.bigDataAndAnalytics = response[0].bigDataAndAnalytics;
                                    $scope.computeCheckboxModel.mobilityAndSocial = response[0].mobilityAndSocial;


                                $scope.computeCheckboxModel.isProvidingDr = response[0].IsProvidingDr;
                                $scope.drProvidedFor = response[0].DrProvidedFor;
                            });
                        }
                    }
                }
            );

            $scope.postUpdate = function(){

                if($scope.selectedDcName !== undefined){

                    var selectedDc;

                    if($scope.selectedDc !== undefined){
                        selectedDc = $scope.selectedDc;
                    }
                    else {
                        selectedDc = $scope.selectedDcName[0].name;
                    }

                    var postData = {
                        requestTitle: $scope.requestTitle,
                        requestDescription: $scope.requestDescription,
                        requestorName: $scope.requestorName,

                        dcName: selectedDc,
                        dcCountry: $scope.dcCountry,
                        dcSiteCode: $scope.dcSiteCode,

                        kwRequired_2016: $scope.kwRequired_2016,
                        kwRequired_2017: $scope.kwRequired_2017,
                        kwRequired_2018: $scope.kwRequired_2018,
                        kwRequired_2019: $scope.kwRequired_2019,
                        kwRequired_2020: $scope.kwRequired_2020,
                        kwRequired_2021: $scope.kwRequired_2021,
                        kwRequired_2022: $scope.kwRequired_2022,
                        kwRequired_2023: $scope.kwRequired_2023,
                        kwRequired_2024: $scope.kwRequired_2024,
                        kwRequired_2025: $scope.kwRequired_2025,

                        kwRequired_2016_nq: $scope.kwRequired_2016_nq,
                        kwRequired_2017_nq: $scope.kwRequired_2017_nq,
                        kwRequired_2018_nq: $scope.kwRequired_2018_nq,
                        kwRequired_2019_nq: $scope.kwRequired_2019_nq,
                        kwRequired_2020_nq: $scope.kwRequired_2020_nq,
                        kwRequired_2021_nq: $scope.kwRequired_2021_nq,
                        kwRequired_2022_nq: $scope.kwRequired_2022_nq,
                        kwRequired_2023_nq: $scope.kwRequired_2023_nq,
                        kwRequired_2024_nq: $scope.kwRequired_2024_nq,
                        kwRequired_2025_nq: $scope.kwRequired_2025_nq,

                        cbRequired_2016: $scope.cbRequired_2016,
                        cbRequired_2017: $scope.cbRequired_2017,
                        cbRequired_2018: $scope.cbRequired_2018,
                        cbRequired_2019: $scope.cbRequired_2019,
                        cbRequired_2020: $scope.cbRequired_2020,
                        cbRequired_2021: $scope.cbRequired_2021,
                        cbRequired_2022: $scope.cbRequired_2022,
                        cbRequired_2023: $scope.cbRequired_2023,
                        cbRequired_2024: $scope.cbRequired_2024,
                        cbRequired_2025: $scope.cbRequired_2025,

                        cbRequired_2016_nq: $scope.cbRequired_2016_nq,
                        cbRequired_2017_nq: $scope.cbRequired_2017_nq,
                        cbRequired_2018_nq: $scope.cbRequired_2018_nq,
                        cbRequired_2019_nq: $scope.cbRequired_2019_nq,
                        cbRequired_2020_nq: $scope.cbRequired_2020_nq,
                        cbRequired_2021_nq: $scope.cbRequired_2021_nq,
                        cbRequired_2022_nq: $scope.cbRequired_2022_nq,
                        cbRequired_2023_nq: $scope.cbRequired_2023_nq,
                        cbRequired_2024_nq: $scope.cbRequired_2024_nq,
                        cbRequired_2025_nq: $scope.cbRequired_2025_nq,

                        cloudCompute:   $scope.computeCheckboxModel.cloudCompute,
                        bizCloudHc: $scope.computeCheckboxModel.bizCloudHc,
                        bizCloud:   $scope.computeCheckboxModel.bizCloud,
                        storageAsAService:  $scope.computeCheckboxModel.storageAsAService,
                        mainframe:  $scope.computeCheckboxModel.mainframe,
                        unixFarm:   $scope.computeCheckboxModel.unixFarm,
                        windowsFarm: $scope.computeCheckboxModel.windowsFarm,
                        as400:  $scope.computeCheckboxModel.as400,
                        myWorkstyle: $scope.computeCheckboxModel.myWorkstyle,
                        cyber:  $scope.computeCheckboxModel.cyber,
                        serviceManagement: $scope.computeCheckboxModel.serviceManagement,
                        lan:    $scope.computeCheckboxModel.lan,
                        wan:    $scope.computeCheckboxModel.wan,
                        isProvidingDr: $scope.computeCheckboxModel.isProvidingDr,
                        drProvidedFor: $scope.drProvidedFor,

                        assetAndConfigurationManagement: $scope.assetAndConfigurationManagement,
                        enterpriseServiceDesk: $scope.enterpriseServiceDesk,
                        firewall: $scope.firewall,
                        clientSiteLocalSupport: $scope.clientSiteLocalSupport,
                        loadBalancers: $scope.loadBalancers,
                        operationalServiceManagement: $scope.operationalServiceManagement,
                        proxy: $scope.proxy,
                        remoteManagementServices: $scope.remoteManagementServices,
                        dns: $scope.dns,
                        serviceIntegrationAndManagement: $scope.serviceIntegrationAndManagement,
                        dataCenterBasedTouchLabor: $scope.dataCenterBasedTouchLabor,
                        serviceRequestManagement: $scope.serviceRequestManagement,
                        agilityPlatform: $scope.agilityPlatform,
                        bigDataAndAnalytics: $scope.bigDataAndAnalytics,
                        mobilityAndSocial: $scope.mobilityAndSocial
                    };
                }

                var json = angular.toJson(postData);
                $http.post('/internal_dc_demand_update', json)
                    .then(function(result)
                    {
                        setTimeout(function(){
                            $http.get("/internal_dc_quote/?fileName=" + result.data,
                                {headers: { 'Accept': 'application/pdf' },
                                    responseType: 'arraybuffer' })
                                .success(function(data) {
                                    var file = new Blob([data], {type: 'application/pdf'});
                                    var fileURL = URL.createObjectURL(file);
                                    resetForm();

                                    var newTab = $window.open('about:blank', '_blank');
                                    newTab.document.write("<object width='600' height='400' data='" + fileURL + "' type='"+ 'application/pdf' +"' ></object>");
                                });
                        }, 1000);


                    });
            };


            $scope.computeCheckboxModel = {
                cloudCompute : false,
                bizCloudHc : false,
                bizCloud:   false,
                storageAsAService:  false,
                mainframe:  false,
                unixFarm:   false,
                windowsFarm:    false,
                as400:  false,
                UcaaS:  false,
                myWorkstyle:    false,
                cyber:  false,
                serviceManagement:  false,
                lan:    false,
                wan:    false,
                isProvidingDr:  false,
                assetAndConfigurationManagement: false,
                enterpriseServiceDesk: false,
                firewall: false,
                clientSiteLocalSupport: false,
                loadBalancers: false,
                operationalServiceManagement: false,
                proxy: false,
                remoteManagementServices: false,
                dns: false,
                serviceIntegrationAndManagement: false,
                dataCenterBasedTouchLabor: false,
                serviceRequestManagement: false,
                agilityPlatform: false,
                bigDataAndAnalytics: false,
                mobilityAndSocial: false
            };


            initDcList();

            initInternalDcDemandList();

        }]);
