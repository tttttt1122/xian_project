/**
 * 全民健康信息平台 - 公共JavaScript文件
 * 包含所有页面共享的工具函数和组件
 */

// ==================== 弹窗管理 ====================
const Modal = {
    // 打开弹窗
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    },

    // 关闭弹窗
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    },

    // 初始化弹窗点击外部关闭
    initClickOutside(modalId, closeCallback) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    if (closeCallback) {
                        closeCallback();
                    } else {
                        modal.classList.remove('show');
                    }
                }
            });
        }
    }
};

// ==================== 表格管理 ====================
const Table = {
    // 渲染表格
    render(options) {
        const {
            containerId,
            data,
            columns,
            rowRenderer
        } = options;

        const tbody = document.getElementById(containerId);
        if (!tbody) return;

        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>`;
            return;
        }

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            if (rowRenderer) {
                row.innerHTML = rowRenderer(item, index);
            } else {
                row.innerHTML = columns.map(col => {
                    const value = col.format ? col.format(item[col.field], item, index) : item[col.field];
                    return `<td>${value}</td>`;
                }).join('');
            }
            tbody.appendChild(row);
        });
    },

    // 更新记录数
    updateCount(countId, count) {
        const el = document.getElementById(countId);
        if (el) {
            el.textContent = count;
        }
    }
};

// ==================== 表单管理 ====================
const Form = {
    // 获取表单数据
    getData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const data = {};
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id) {
                data[input.id] = input.value.trim();
            }
        });
        return data;
    },

    // 设置表单数据
    setData(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.keys(data).forEach(key => {
            const input = form.querySelector(`#${key}`);
            if (input) {
                input.value = data[key];
            }
        });
    },

    // 重置表单
    reset(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    // 清空表单数据
    clearData(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.value = '';
        });
    },

    // 验证必填项
    validate(formId, requiredFields) {
        const data = this.getData(formId);
        for (const field of requiredFields) {
            if (!data[field]) {
                return false;
            }
        }
        return true;
    }
};

// ==================== 搜索管理 ====================
const Search = {
    // 获取搜索条件
    getConditions(fieldIds) {
        const conditions = {};
        fieldIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                conditions[id] = el.value.trim().toLowerCase();
            }
        });
        return conditions;
    },

    // 重置搜索条件
    reset(fieldIds) {
        fieldIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = '';
            }
        });
    },

    // 过滤数据
    filter(data, conditions, matchFn) {
        return data.filter(item => matchFn(item, conditions));
    }
};

// ==================== 分页管理 ====================
const Pagination = {
    // 生成分页HTML
    render(options) {
        const {
            currentPage = 1,
            totalPages,
            onPageChange
        } = options;

        let html = '';

        // 上一页
        html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<button class="page-btn active">${i}</button>`;
            } else {
                html += `<button class="page-btn" onclick="${onPageChange}(${i})">${i}</button>`;
            }
        }

        // 下一页
        html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;

        // 总页数信息
        html += `<span class="page-info">共 ${totalPages} 页</span>`;

        return html;
    }
};

// ==================== 工具函数 ====================
const Utils = {
    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    },

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 深拷贝
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // 防抖
    debounce(fn, delay = 300) {
        let timer = null;
        return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    },

    // 节流
    throttle(fn, interval = 300) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= interval) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    }
};

// ==================== 状态标签生成器 ====================
const StatusBadge = {
    // 生成状态标签HTML
    create(status, text, icon = '') {
        const iconHtml = icon ? `<i class="fas ${icon}"></i>` : '';
        return `<span class="status-badge status-${status}">${iconHtml} ${text}</span>`;
    },

    // 启用/禁用状态
    enabled(isEnabled) {
        return isEnabled
            ? this.create('enabled', '启用', 'fa-check-circle')
            : this.create('disabled', '禁用', 'fa-ban');
    },

    // 正常/暂停状态
    normal(isNormal) {
        return isNormal
            ? this.create('normal', '正常运营', 'fa-check-circle')
            : this.create('suspended', '暂停服务', 'fa-pause-circle');
    },

    // 成功/失败状态
    success(isSuccess) {
        return isSuccess
            ? this.create('success', '成功', 'fa-check-circle')
            : this.create('fail', '失败', 'fa-times-circle');
    }
};

// ==================== 确认对话框 ====================
const ConfirmDialog = {
    // 显示确认对话框
    show(options) {
        const {
            title = '确认',
            message,
            subMessage = '',
            type = 'warning', // warning, danger
            onConfirm,
            onCancel
        } = options;

        // 创建弹窗元素
        const modalId = 'confirmDialog_' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal confirm-modal show';
        modal.innerHTML = `
            <div class="modal-content modal-sm">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="ConfirmDialog.close('${modalId}')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="confirm-body">
                        <div class="confirm-icon ${type}">
                            <i class="fas ${type === 'danger' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'}"></i>
                        </div>
                        <p class="confirm-text">${message}</p>
                        ${subMessage ? `<p class="confirm-subtext">${subMessage}</p>` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" onclick="ConfirmDialog.close('${modalId}', ${onCancel ? 'true' : 'false'})">取消</button>
                    <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'}" onclick="ConfirmDialog.confirm('${modalId}', ${onConfirm ? 'true' : 'false'})">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                ConfirmDialog.close(modalId, onCancel);
            }
        });

        return modalId;
    },

    // 关闭弹窗
    close(modalId, callback) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
        if (callback && typeof callback === 'function') {
            callback();
        }
    },

    // 确认
    confirm(modalId, callback) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
};

// ==================== 导出功能 ====================
const ExportUtil = {
    // 导出JSON数据
    toJSON(data, filename = 'export.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.download(blob, filename);
    },

    // 导出CSV数据
    toCSV(data, headers, filename = 'export.csv') {
        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            csv += row.join(',') + '\n';
        });
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        this.download(blob, filename);
    },

    // 下载文件
    download(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 全局初始化逻辑
    console.log('Common JS loaded');
});
