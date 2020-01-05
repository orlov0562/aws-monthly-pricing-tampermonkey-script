// ==UserScript==
// @name         AWS monthly pricing
// @namespace    https://github.com/orlov0562/aws-monthly-pricing-tampermonkey-script
// @version      0.1
// @description  try to take over the world!
// @author       Vitaly Orlov
// @match        https://aws.amazon.com/*pricing*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function ($, undefined) {
  'use strict';
  $(function () {
      let monthBtnStyles = [
          'position:fixed',
          'bottom: 15px',
          'left:5px',
          'z-index:10000',
          'color: white',
          'background-color: #ec7211',
          'background-image: linear-gradient(180deg,#f67c1b 0,#e15500)',
          'border: 1px solid #e76d0c',
          'border-radius:4px',
          'padding: 5px 10px',
          'box-shadow: inset 0 1px 0 hsla(0,0%,100%,.2)'
      ];
      let calcBtn = $('<button/>',{
          text: 'Add monthly pricing',
          style: monthBtnStyles.join(';'),
          click: ()=>{
              let tables = $('.aws-plc-content table');
              let priceColumnMarkers = ['Цена за час','Price Per Hour','Effective Hourly','почасовой тариф'];
              let priceCellMarkers = ['USD за час','per Hour'];

              for (let ti=0; ti<tables.length; ti++) {
                  let columnId = -1;
                  let tr = $(tables[ti]).find('tr');
                  for (let tri=0; tri<tr.length; tri++) {
                      let th = $(tr[tri]).find('th');
                      for (let thi=0; thi<th.length; thi++) {
                          for (let k=0; k<priceColumnMarkers.length; k++){
                              if ($(th[thi]).text().indexOf(priceColumnMarkers[k]) !== -1){
                                  columnId = thi;
                                  break;
                              }
                          }
                          if (columnId>-1) break;
                      }
                      if (columnId>-1) break;
                  }

                  let applyMonthlyCalculation = (td) => {
                      let tdEl = $(td);
                      if (tdEl.find('.month-pricing').length) return;
                      let priceCellText = tdEl.text().trim();
                      let matches = priceCellText.match(/(\d+,\d+)\sUSD/);
                      if (!matches || !matches.length) {
                          matches = priceCellText.match(/\$(\d+\.\d+)/);
                      }
                      if (!matches || !matches.length) return;
                      let price = parseFloat(matches[1].replace(',','.'));
                      let monthlyPrice = price * 24 * 31;
                      let monthlyPriceEl = $('<div/>',{
                          class: 'month-pricing',
                          text: monthlyPrice.toFixed(2)+' USD/month',
                          title: price + ' * 24 * 31 = '+monthlyPrice.toFixed(2)+' USD/month',
                          style: 'font-size: 11px; background-color:#e5eaef; padding:3px;'
                      });
                      tdEl.append(monthlyPriceEl);
                  };

                  if (columnId>-1) { // if price column found by marker
                      for (let tri=0; tri<tr.length; tri++) {
                          let td = $(tr[tri]).find('td');
                          if (columnId >= td.length) continue;
                          applyMonthlyCalculation(td[columnId]);
                      }
                  } else { // if not then find cell markers
                      for (let tri=0; tri<tr.length; tri++) {
                          let td = $(tr[tri]).find('td');
                          for (let tdi=0; tdi<td.length; tdi++){
                              for (let k=0; k<priceCellMarkers.length; k++){
                                  if ($(td[tdi]).text().indexOf(priceCellMarkers[k]) !== -1){
                                      applyMonthlyCalculation(td[tdi]);
                                      break;
                                  }
                              }
                          }
                      }
                  }

              }
          }
      });
      $('body').append(calcBtn);
  });
})(window.jQuery.noConflict(true));
