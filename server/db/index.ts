import devDataset from '../dataset.json';
import testDataset from '../fixtures/test-dataset';
import { Article } from '../types/article';
import { TimeRange } from '../types/timeRange';
import {
  totalArticleMonthTraffic,
  totalArticleYesterdayTraffic,
  totalArticleTodayTraffic
} from './aggregation';
import {
  getArticleTraffic,
  getArticlesTraffic,
  TotalTraffic,
} from './filter';
import { isValidId, isValidTimeRange } from '../utils/validation';

const localDataset = process.env.NODE_ENV === 'test' ? testDataset : devDataset;

type ProcessedArticle = Partial<Article> & {
  timeRange?: string;
  data?: number[];
  labels?: string[];
  totalTraffic?: number;
}

class Database {
  private articles: Article[] = localDataset.traffic_data || [];

  findByTimeRange(timeRange: TimeRange) {
    if (!isValidTimeRange(timeRange)) return null;

    const traffic = getArticlesTraffic(this.articles, timeRange);
    const articles: Partial<Article>[] = this.articles.map((article) => ({
      id: article.id,
      url: article.url,
      author: article.author,
      image_url: article.image_url,
      totalTraffic: this.getTotalTraffic(article, timeRange)
    }));

    return {
      articles,
      data: this.getData(traffic),
      labels: this.getLabels(traffic, timeRange)
    };
  }

  findOneByTimeRange(id: number, timeRange: TimeRange): ProcessedArticle | null {
    if (!isValidId(id) || !isValidTimeRange(timeRange)) return null;

    const article = this.articles[id - 1];

    if (!article) {
      console.log('article was not found');
      return null;
    }

    const traffic = getArticleTraffic[timeRange](article);

    return {
      id: article.id,
      url: article.url,
      author: article.author,
      image_url: article.image_url,
      data: this.getData(traffic),
      labels: this.getLabels(traffic, timeRange),
      totalTraffic: this.getTotalTraffic(article, timeRange)
    };
  }

  private getLabels(traffic: TotalTraffic, timeRange: TimeRange) {
    if (timeRange === TimeRange.MONTH || timeRange === TimeRange.WEEK) {
      return traffic?.map(item => `${item.day}`.padStart(2, '0'));
    }

    return traffic?.map(item => `${item.hour}`.padStart(2, '0'));
  }

  private getData(traffic: TotalTraffic) {
    return traffic?.map(item => item.traffic);
  }

  private getTotalTraffic(article: Article, timeRange: TimeRange) {
    if (timeRange === TimeRange.MONTH || timeRange === TimeRange.WEEK) {
      return totalArticleMonthTraffic(article, timeRange === TimeRange.WEEK);
    } else if (timeRange === TimeRange.YESTERDAY) {
      return totalArticleYesterdayTraffic(article);
    } else {
      return totalArticleTodayTraffic(article);
    }
  }
}

const database = new Database();

export default database;