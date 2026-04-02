<?php

namespace Drupal\promet_showcase\Plugin\rest\resource;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a flattened REST resource for Promet Showcase nodes.
 *
 * This endpoint exists alongside JSON:API to demonstrate both patterns:
 *  - JSON:API  → /jsonapi/node/promet_showcase   (standard, feature-rich)
 *  - This resource → /api/promet-showcase         (custom, consumer-optimised)
 *
 * @RestResource(
 *   id = "promet_showcase_resource",
 *   label = @Translation("Promet Showcase Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/promet-showcase"
 *   }
 * )
 */
class PrometShowcaseResource extends ResourceBase {

  /**
   * The entity type manager.
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    EntityTypeManagerInterface $entity_type_manager,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(
    ContainerInterface $container,
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
  ): static {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('promet_showcase'),
      $container->get('entity_type.manager'),
    );
  }

  /**
   * Responds to GET /api/promet-showcase.
   *
   * Returns a flat array of published Promet Showcase nodes, ordered by
   * creation date descending. Each item is shaped for direct consumption
   * by the React PWA without further client-side normalisation.
   *
   * @return \Drupal\rest\ResourceResponse
   *   A cacheable JSON response.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   */
  public function get(): ResourceResponse {
    try {
      $storage = $this->entityTypeManager->getStorage('node');

      $nids = $storage->getQuery()
        ->condition('type', 'promet_showcase')
        ->condition('status', 1)
        ->sort('created', 'DESC')
        ->range(0, 20)
        ->accessCheck(TRUE)
        ->execute();

      $nodes = $storage->loadMultiple($nids);
      $items = [];

      foreach ($nodes as $node) {
        $url_field = $node->get('field_showcase_url');
        $project_url = NULL;
        $project_url_title = NULL;

        if (!$url_field->isEmpty()) {
          $link        = $url_field->first();
          $project_url       = $link->uri ?? NULL;
          $project_url_title = $link->title ?? NULL;
        }

        $items[] = [
          'id'          => (int) $node->id(),
          'title'       => $node->label(),
          'summary'     => $node->get('field_showcase_summary')->value ?? '',
          'category'    => $node->get('field_showcase_category')->value ?? '',
          'projectUrl'  => $project_url,
          'projectUrlTitle' => $project_url_title,
          'created'     => (int) $node->getCreatedTime(),
          'changed'     => (int) $node->getChangedTime(),
          'path'        => $node->toUrl()->toString(),
        ];
      }

      $response = new ResourceResponse(['data' => $items], 200);

      // Cache per URL, invalidate when any promet_showcase node changes.
      $cache_metadata = $response->getCacheableMetadata();
      $cache_metadata->addCacheTags(['node_list:promet_showcase']);
      $cache_metadata->addCacheContexts(['url.query_args']);

      return $response;
    }
    catch (\Exception $e) {
      $this->logger->error('Promet Showcase REST resource error: @msg', ['@msg' => $e->getMessage()]);
      throw new HttpException(500, 'An error occurred fetching showcase items.');
    }
  }

}
